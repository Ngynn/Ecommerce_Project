// src/components/Header/Header.jsx

import { NavLink } from "react-router-dom";
import "../Header/header.css";
import "../../theme/theme.css";
import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { FaUserCircle, FaShoppingCart, FaSearch } from "react-icons/fa";
import { useCart } from "../../context/CartContext"; // ✅ import context
import Logo from "../../assets/images/DigitexLogoWhite.png";
import { menuCategories } from "../Category/Category";
<<<<<<< HEAD
// ✅ Đảm bảo import useAuth
import { useAuth } from "../../context/AuthContext";
=======
>>>>>>> c6e1c65e900e61c7abfc3ececeed678933ca946e

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => setShowMenu(!showMenu);

<<<<<<< HEAD
  // ✅ Lấy trạng thái xác thực và thông tin khách hàng
  const { isAuthenticated, customer, logout } = useAuth();

  // Hàm tạo tên hiển thị ngắn gọn
  const getCustomerDisplayName = () => {
    if (!customer) return "Khách hàng";
    return customer.first_name || customer.email.split("@")[0];
  };

=======
  const { cart } = useCart(); // ✅ lấy giỏ hàng
    const cartCount = cart.length;
>>>>>>> c6e1c65e900e61c7abfc3ececeed678933ca946e
  return (
    <header className="header">
      {/* 1. Menu Danh mục */}
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

<<<<<<< HEAD
      {/* 2. Logo */}
=======
>>>>>>> c6e1c65e900e61c7abfc3ececeed678933ca946e
      <NavLink to="/">
        <h1 className="logo">
          <img src={Logo} alt="Logo Website" />
        </h1>
      </NavLink>

      {/* 3. Thanh Tìm kiếm */}
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

<<<<<<< HEAD
      {/* 4. Menu Điều hướng chính */}
=======
>>>>>>> c6e1c65e900e61c7abfc3ececeed678933ca946e
      <nav>
        {/* ... Các liên kết chung */}
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Giới thiệu
        </NavLink>
        <NavLink
          to="/policy"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Chính sách
        </NavLink>
        <NavLink
          to="/products"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Sản phẩm
        </NavLink>
<<<<<<< HEAD
=======

>>>>>>> c6e1c65e900e61c7abfc3ececeed678933ca946e
        <NavLink
          to="/faqs"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          FAQs
        </NavLink>

<<<<<<< HEAD
        {/* 5. Giỏ hàng */}
=======
        {/* ✅ Giỏ hàng có badge */}
>>>>>>> c6e1c65e900e61c7abfc3ececeed678933ca946e
        <NavLink
          to="/cart"
          className={({ isActive }) =>
            isActive ? "nav-link active cart-link" : "nav-link cart-link"
          }
        >
          <FaShoppingCart className="icon" />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </NavLink>

        {/* 6. Trạng thái Đăng nhập/Đăng ký */}
        {isAuthenticated ? (
          <>
            {/* Nếu đã đăng nhập: Hiển thị tên và nút Đăng xuất */}
            {/* Thêm link đến trang /account để quản lý hồ sơ */}
            <NavLink
              to="/profile" // 💡 Giả sử trang quản lý hồ sơ là /account
              className={({ isActive }) =>
                isActive
                  ? "nav-link nav-link-account active"
                  : "nav-link nav-link-account"
              }
            >
              <FaUserCircle className="icon" style={{ marginRight: "5px" }} />
              {getCustomerDisplayName()}
            </NavLink>

            {/* Nút Đăng xuất */}
            <button
              onClick={logout}
              className="nav-link logout-button"
              title="Đăng xuất"
            >
              Đăng xuất
            </button>
          </>
        ) : (
          /* Nếu chưa đăng nhập: Hiển thị link Đăng nhập/Đăng ký */
          <NavLink
            to="/login" // 💡 Chuyển hướng đến trang Đăng nhập thay vì Đăng ký (Register)
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            title="Đăng nhập / Đăng ký"
          >
            <FaUserCircle className="icon" />
          </NavLink>
        )}
      </nav>
    </header>
  );
}
