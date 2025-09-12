import React from "react";
import {
  Mail,
  MapPin,
  Phone,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  PawPrint,
} from "lucide-react";

const links = {
  shop: [
    { label: "All Products", href: "/products" },
    { label: "New Arrivals", href: "/products?sort=new" },
    { label: "Best Sellers", href: "/products?sort=popular" },
    { label: "Deals & Offers", href: "/deals" },
  ],
  categories: [
    { label: "Dog Supplies", href: "/products/category/Dog Food" },
    { label: "Cat Supplies", href: "/products/category/Cat Food" },
    { label: "Bird Food", href: "/products/category/Bird%20Food" },
    { label: "Fish & Aquatics", href: "/products/category/Fish Food" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Shipping & Returns", href: "/policies/shipping" },
    { label: "Privacy Policy", href: "/policies/privacy" },
    { label: "Terms of Service", href: "/policies/terms" },
  ],
};

const SocialIcon = ({ Icon, label, href }) => (
  <a
    href={href}
    aria-label={label}
    className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-gray-100 hover:bg-black hover:text-white transition"
  >
    <Icon className="h-5 w-5" />
  </a>
);

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <PawPrint className="h-7 w-7 text-black" />
              <span className="text-xl font-extrabold tracking-tight">
                AnimalStore
              </span>
            </div>
            <p className="mt-3 text-sm text-gray-600 max-w-xs">
              Everything your furry, feathery, and fishy friends love — all in
              one place.
            </p>
            <div className="flex gap-3 mt-4">
              <SocialIcon Icon={Facebook} label="Facebook" href="#" />
              <SocialIcon Icon={Instagram} label="Instagram" href="#" />
              <SocialIcon Icon={Twitter} label="Twitter" href="#" />
              <SocialIcon Icon={Youtube} label="YouTube" href="#" />
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-3">
              Shop
            </h3>
            <ul className="space-y-2">
              {links.shop.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-gray-600 hover:text-black transition"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-3">
              Categories
            </h3>
            <ul className="space-y-2">
              {links.categories.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-gray-600 hover:text-black transition"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-3">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 shrink-0" />
                <span>AnimalStore HQ, Pune, MH 411001</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 shrink-0" />
                <a href="tel:+919309530158" className="hover:text-black">
                  +91 93095 30158
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 shrink-0" />
                <a
                  href="mailto:support@animalstore.in"
                  className="hover:text-black"
                >
                  support@animalstore.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} AnimalStore. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
            <span>INR</span>
            <span>English (IN)</span>
            <span>UPI • Cards • Netbanking</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
