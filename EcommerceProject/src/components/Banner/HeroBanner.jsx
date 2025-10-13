import React from "react";
import { useNavigate } from "react-router-dom";
import "./HeroBanner.css";

const HeroBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-banner">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1>Website mới - Nâng tầm trải nghiệm khách hàng</h1>
        <p>
          Demo Shop chính thức ra mắt website mới, hỗ trợ thanh toán 24/7 và
          quản lý đơn hàng tự động, giúp khách hàng có trải nghiệm tốt nhất khi
          mua hàng. Sự hài lòng và tin tưởng của khách hàng là tiêu chí phấn đấu
          của chúng tôi.
        </p>
        <button className="btn-hero" onClick={() => navigate("/products")}>
          Khám phá ngay
        </button>
      </div>
    </section>
  );
};

export default HeroBanner;
