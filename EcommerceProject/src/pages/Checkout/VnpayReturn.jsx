// src/pages/VnpayReturn.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./VnpayReturn.css";

export default function VnpayReturn() {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const params = Object.fromEntries(searchParams.entries());

  const success = params.vnp_ResponseCode === "00";

  return (
    <div className="vnpay-return-wrapper">
      <div className="vnpay-card">
        <h1 className="vnpay-title">Thanh toán VNPay</h1>

        <div className={`vnpay-status ${success ? "success" : "failed"}`}>
          {success ? "✅ Thanh toán thành công!" : "❌ Thanh toán thất bại"}
        </div>

        <div className="vnpay-details">
          <div className="detail-row">
            <span>Mã đơn hàng:</span>
            <strong>{params.vnp_TxnRef || "-"}</strong>
          </div>
          <div className="detail-row">
            <span>Số tiền:</span>
            <strong>
              {params.vnp_Amount
                ? (params.vnp_Amount / 100).toLocaleString() + " đ"
                : "-"}
            </strong>
          </div>
          <div className="detail-row">
            <span>Mã phản hồi VNPay:</span>
            <strong>{params.vnp_ResponseCode || "-"}</strong>
          </div>
          <div className="detail-row">
            <span>Ngày giao dịch:</span>
            <strong>
              {params.vnp_PayDate
                ? params.vnp_PayDate.replace(
                    /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
                    "$3/$2/$1 $4:$5:$6"
                  )
                : "-"}
            </strong>
          </div>
          <div className="detail-row">
            <span>Ngân hàng:</span>
            <strong>{params.vnp_BankCode || "-"}</strong>
          </div>
        </div>

        <button className="vnpay-back-btn" onClick={() => navigate("/")}>
          🔙 Quay về trang chủ
        </button>
      </div>
    </div>
  );
}
