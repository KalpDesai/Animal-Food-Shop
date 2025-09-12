// src/utils/OrderReceiptPDF.jsx
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";

// Register Roboto font from Google Fonts
Font.register({
  family: "Roboto",
  src: "/fonts/Roboto-Regular.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 11,
    fontFamily: "Roboto",
    lineHeight: 1.6,
    backgroundColor: "#fff",
  },
  header: {
    textAlign: "center",
    fontSize: 22,
    marginBottom: 4,
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    paddingBottom: 4,
  },
  storeInfo: {
    textAlign: "center",
    fontSize: 9,
    marginBottom: 16,
    color: "#555",
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    marginBottom: 6,
    fontWeight: "bold",
    textDecoration: "underline",
    color: "#000",
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 16,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "35%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f3f3f3",
    padding: 6,
  },
  tableCol: {
    width: "35%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 6,
  },
  tableColSmall: {
    width: "15%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 6,
  },
  tableCellHeader: {
    fontWeight: "bold",
    fontSize: 11,
    color: "#000",
  },
  tableCell: {
    fontSize: 11,
    color: "#333",
  },
  totals: {
    marginTop: 20,
    flexDirection: "column",
    alignItems: "flex-end",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "40%",
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 11,
    color: "#000",
  },
  totalValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#000",
  },
  qrCodeContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  qrCodeImage: {
    width: 100,
    height: 100,
  },
  footer: {
    textAlign: "center",
    fontSize: 9,
    marginTop: 12,
    color: "#888",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 8,
  },
});

const OrderReceiptPDF = ({ order, qrCode }) => {
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <Text style={styles.header}>ANIMAL STORE</Text>
        <Text style={styles.storeInfo}>
          123 Pet Street, Pet City | Email: support@animalstore.com | Phone: +91 9876543210
        </Text>

        {/* Order Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          <Text>Order ID: {order._id}</Text>
          <Text>Date: {new Date(order.createdAt).toLocaleString()}</Text>
          <Text>Email: {order.user?.email || "N/A"}</Text>
          <Text>
            Address:{" "}
            {order.shippingInfo
              ? `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.postalCode}, ${order.shippingInfo.country}`
              : "N/A"}
          </Text>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableColHeader, styles.tableCellHeader]}>Item</Text>
            <Text style={[styles.tableColSmall, styles.tableCellHeader]}>Qty</Text>
            <Text style={[styles.tableColSmall, styles.tableCellHeader]}>Price</Text>
            <Text style={[styles.tableColSmall, styles.tableCellHeader]}>Total</Text>
          </View>

          {order.items.map((item) => (
            <View style={styles.tableRow} key={item._id}>
              <Text style={[styles.tableCol, styles.tableCell]}>{item.product.name}</Text>
              <Text style={[styles.tableColSmall, styles.tableCell]}>{item.quantity}</Text>
              <Text style={[styles.tableColSmall, styles.tableCell]}>₹{item.product.price}</Text>
              <Text style={[styles.tableColSmall, styles.tableCell]}>
                ₹{item.quantity * item.product.price}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>₹{subtotal}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax (5% GST):</Text>
            <Text style={styles.totalValue}>₹{tax}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>₹{total}</Text>
          </View>
        </View>

        {/* QR Code */}
        {qrCode && (
          <View style={styles.qrCodeContainer}>
            <Image style={styles.qrCodeImage} src={qrCode} />
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>Thank you for shopping with us!</Text>
      </Page>
    </Document>
  );
};

export default OrderReceiptPDF;
