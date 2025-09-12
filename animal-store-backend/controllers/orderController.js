const Order = require('../models/Order');
const Product = require('../models/Product');

const createOrder = async (req, res) => {
  try {
    const { items, shippingInfo } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    // Validate products and calculate total
    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive || product.stock < item.quantity) {
        return res.status(400).json({ message: `Invalid product or quantity: ${item.product}` });
      }

      validatedItems.push({
        product: product._id,
        quantity: item.quantity
      });

      totalAmount += product.price * item.quantity;

      // Optional: Decrease stock
      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      user: req.user._id, // assumes user is authenticated
      items: validatedItems,
      shippingInfo,
      totalAmount
    });

    res.status(201).json({
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Order failed', error: error.message });
  }
};


const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name price imageUrl') // optional: select fields
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};


const getAllOrders = async (req, res) => {
  try {
    // Allow only admins
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const orders = await Order.find()
      .populate('user', 'name email mobile')
      .populate('items.product', 'name price imageUrl')
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get orders', error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Allow only admins
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
};


const editOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { shippingInfo } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only the user who placed the order can edit it
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to edit this order' });
    }

    // Allow edits only if order is not yet shipped
    const notEditableStatuses = ['Shipped', 'Delivered', 'Cancelled'];
    if (notEditableStatuses.includes(order.status)) {
      return res.status(400).json({ message: 'Cannot edit details after order is shipped or processed' });
    }

    // Update only allowed fields
    order.shippingInfo = {
      ...order.shippingInfo,
      ...shippingInfo
    };

    await order.save();

    res.status(200).json({ message: 'Order details updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order details', error: error.message });
  }
};


module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  editOrderDetails
};
