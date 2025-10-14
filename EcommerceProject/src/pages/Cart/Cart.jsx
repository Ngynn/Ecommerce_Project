import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import "./Cart.css";
import vnpayLogo from "../../images/vnpay-logo.png";
import momoLogo from "../../images/momo-logo.png";

// 👉 Bạn chuẩn bị sẵn 2 ảnh QR trong thư mục images
// import vnpayQR from "../../images/vnpay-qr-demo.png";
// import momoQR from "../../images/momo-qr-demo.png";

export default function Cart() {
  const { cart, removeFromCart } = useCart();
  const [promo, setPromo] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState([]); // danh sách sản phẩm được chọn
  const [qrCode, setQrCode] = useState(null); // ✅ ảnh QR hiện tại (VNPay hoặc MoMo)

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const applyPromo = () => {
    alert(`Mã ưu đãi: ${promo || "Chưa nhập"}`);
  };

  async function payVnpay() {
    const res = await fetch("http://localhost:8888/create_payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total }), // gửi tổng tiền
    });
    const data = await res.json();

    console.log("Payment URL: ", data);

    window.location.href = data.data; // redirect tới VNPay
  }

  async function payMomo() {
    const res = await fetch("http://localhost:8888/create-momo-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: total, // tổng tiền
        orderInfo: "Thanh toán đơn hàng #123",
      }),
    });

    const data = await res.json();
    console.log("MoMo response:", data);

    // ✅ Redirect tới payUrl
    if (data && data.payUrl) {
      window.location.href = data.payUrl;
    } else {
      alert("Không nhận được payUrl từ MoMo");
    }
  }

  // Chỉ tính tổng các sản phẩm được chọn
  const total = cart.reduce((sum, item) => {
    
    if (!selected.includes(item.id)) return sum;
    const price = item?.variants?.[0]?.calculated_price?.calculated_amount || 0;

    return sum + price;
  }, 0);

  if (!cart.length) {
    return <div className="cart-empty">🛒 Giỏ hàng của bạn đang trống</div>;
  }

  return (
    <div className="cart-wrapper">
      {/* LEFT */}
      <div className="cart-left">
        <h2>Giỏ hàng ({cart.length} sản phẩm)</h2>

        {cart.map((item, index) => {
          // const price = item?.variants?.[0]?.prices?.[0]?.amount / 100 || 0;
          const price = item?.variants?.[0]?.calculated_price?.calculated_amount || 0;

          return (
            <div key={index} className="cart-row">
              <input
                type="checkbox"
                className="cart-check"
                checked={selected.includes(item.id)}
                onChange={() => toggleSelect(item.id)}
              />
              <img
                src={item.thumbnail || "https://via.placeholder.com/100"}
                alt={item.title}
              />
              <div className="cart-info">
                <h3>{item.title}</h3>
                <p className="price">{price.toLocaleString()} đ</p>
              </div>
              <button
                className="remove"
                onClick={() => removeFromCart(item.id)}
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>

      {/* RIGHT */}
      <div className="cart-right">
        <div className="summary">
          <h3>Thanh toán</h3>

          {/* Mã ưu đãi */}
          <div className="input-group">
            <label>Mã ưu đãi</label>
            <div className="input-row">
              <input
                type="text"
                placeholder="Nhập mã"
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
              />
              <button className="apply-btn" onClick={applyPromo}>
                Áp dụng
              </button>
            </div>
          </div>

          {/* Số điện thoại */}
          <div className="input-group">
            <label>Liên hệ</label>
            <div className="input-row phone">
              <span className="prefix">+84</span>
              <input
                type="tel"
                placeholder="Nhập số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Email */}
          <div className="input-group">
            <label>Email</label>
            <div className="input-row">
              <input
                type="text"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Tổng tiền */}
          <div className="line">
            <span>Tổng tiền</span>
            <strong>{total.toLocaleString()} đ</strong>
          </div>

          {/* Nút thanh toán nhanh */}
          <div className="pay-alt">
            <button className="qr-btn vnpay-btn" onClick={() => payVnpay()}>
              <img src={vnpayLogo} alt="VNPay" className="pay-logo" />
              Thanh toán với VNPay QR
            </button>
            <button className="qr-btn momo-btn" onClick={() => payMomo()}>
              <img src={momoLogo} alt="MoMo" className="pay-logo" />
              Thanh toán với MoMo QR
            </button>
          </div>

          {/* Hiển thị QR Code */}
          {qrCode && (
            <div className="qr-preview">
              <h4>Quét mã để thanh toán</h4>
              <img src={qrCode} alt="QR Code" className="qr-image" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
