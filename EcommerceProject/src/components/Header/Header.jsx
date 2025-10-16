import { NavLink } from "react-router-dom";
import "../Header/header.css";
import "../../theme/theme.css";
import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { FaUserCircle, FaShoppingCart, FaSearch } from "react-icons/fa";
import { useCart } from "../../context/CartContext"; // ✅ import context

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => setShowMenu(!showMenu);

  const { cart } = useCart(); // ✅ lấy giỏ hàng
    const cartCount = cart.length;
  return (
    <header className="header">
      <div className="action-menu">
        <button onClick={toggleMenu} className="menu-button">
          <FiMenu className="icon" />
          <span className="text-menu-button"> Danh mục sản phẩm</span>
        </button>
        {showMenu && (
          <div className="dropdown-menu">
            <NavLink to="/products?category=Làm Việc" className="menu-item">
              Làm Việc
            </NavLink>
            <NavLink to="/products?category=Giải Trí" className="menu-item">
              Giải Trí
            </NavLink>
            <NavLink to="/products?category=Học Tập" className="menu-item">
              Học Tập
            </NavLink>
            <NavLink to="/products?category=Tiện Ích" className="menu-item">
              Tiện Ích
            </NavLink>
            <NavLink to="/products?category=Windows" className="menu-item">
              Windows
            </NavLink>
            <NavLink to="/products?category=Microsoft" className="menu-item">
              Microsoft
            </NavLink>
            <NavLink to="/products?category=Diệt Virus" className="menu-item">
              Diệt Virus
            </NavLink>
            <NavLink to="/products?category=VPN" className="menu-item">
              VPN
            </NavLink>
          </div>
        )}
      </div>

      <NavLink to="/">
        <h1 className="logo">Shop</h1>
      </NavLink>

      <div className="search-bar">
        <input
          type="text"
          id="search"
          name="search"
          placeholder="Tìm kiếm..."
          className="search-input"
          aria-label="Search"
        />
        <button className="search-button">
          <FaSearch className="icon" />
        </button>
      </div>

      <nav>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Giới thiệu
        </NavLink>
        <NavLink
          to="/products"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Sản phẩm
        </NavLink>

        <NavLink
          to="/faqs"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          FAQs
        </NavLink>

        {/* ✅ Giỏ hàng có badge */}
        <NavLink
          to="/cart"
          className={({ isActive }) =>
            isActive ? "nav-link active cart-link" : "nav-link cart-link"
          }
        >
          <FaShoppingCart className="icon" />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </NavLink>

        <NavLink
          to="/register"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <FaUserCircle className="icon" />
        </NavLink>
      </nav>
    </header>
  );
}
