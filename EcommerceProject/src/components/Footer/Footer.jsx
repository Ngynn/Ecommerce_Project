import React from "react";
import "./FooterIntro.css";
import { FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa"; // đổi FaEnvelope -> FaInstagram

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-main">
        {/* Logo + Social */}
        <div className="footer-logo-social">
          <img src="/logo.png" alt="Demo Shop Logo" className="footer-logo" />
          <div className="footer-social">
            <a
              href="https://www.facebook.com/amitgroup.vn"
              target="_blank"
              rel="noreferrer"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.facebook.com/amitgroup.vn"
              target="_blank"
              rel="noreferrer"
            >
              <FaInstagram /> {/* ✅ logo Instagram */}
            </a>
            <a
              href="https://www.youtube.com/@AmitGROUPmkt"
              target="_blank"
              rel="noreferrer"
            >
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Giới thiệu */}
        <div className="footer-intro">
          <h4>Giới thiệu</h4>
          <p>
            Demo Shop – Địa chỉ uy tín chuyên cung cấp phần mềm bản quyền chính
            hãng với giá tốt. Chúng tôi cam kết mang đến sản phẩm chất lượng
            cao, đa dạng từ các lĩnh vực như AI, thiết kế, văn phòng, bảo mật,
            và giải trí, cùng dịch vụ hỗ trợ khách hàng tận tâm 24/7.
          </p>
          <ul>
            <li>📞 0911 000 038</li>
            <li>✉️ info@demoshop.com</li>
            <li>
              📍 7 Đường số 7C, Khu đô thị An Phú An Khánh, Thủ Đức, HCM 71106
            </li>
            <li>⏰ 8:00 – 18:00</li>
          </ul>
        </div>

        {/* Thông tin chung */}
        <div className="footer-links">
          <h4>Thông tin chung</h4>
          <ul>
            <li>Giới thiệu</li>
            <li>Liên hệ</li>
            <li>Hướng dẫn</li>
            <li>Chính sách</li>
            <li>Tin tức</li>
            <li>FAQs</li>
          </ul>
        </div>

        {/* Sản phẩm */}
        <div className="footer-products">
          <h4>Sản phẩm</h4>
          <ul>
            <li>Tài khoản ChatGPT Plus</li>
            <li>Tài khoản Canva Pro</li>
            <li>Tài khoản Netflix Giá Rẻ</li>
            <li>Tài khoản Spotify Premium</li>
            <li>Key Bản Quyền Office</li>
            <li>Tài khoản Discord Nitro</li>
            <li>Tài khoản Figma Pro</li>
            <li>Tài khoản Adobe CC</li>
          </ul>
        </div>

        {/* Box hỗ trợ 24/7 */}
        <div className="footer-support">
          <h4>Hỗ trợ 24/7</h4>
          <p>📞 Gọi hotline: 0911 000 038</p>
          <p>Zalo: 0911 000 038</p>
          <p>Messenger: DemoShop</p>
          <p>📢 Báo cáo sự cố qua số hotline</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Demo Shop. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
