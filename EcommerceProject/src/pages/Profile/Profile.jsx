// src/pages/Profile/Profile.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
// 1️⃣ Import thêm apiAuthClient để gọi API reset password
import { apiCustomerClient, apiAuthClient } from "../../lib/medusa"; 
import { toast } from "react-toastify";
// import các icon nếu cần, ở đây dùng css button có sẵn nên có thể lược bỏ icon mắt
import "./profile.css";

const AUTH_TOKEN_KEY = "medusa_auth_token";

export default function Profile() {
  const { customer, isLoading, isAuthenticated, fetchCustomer } = useAuth();

  // State quản lý chế độ: 'view' (xem), 'edit_profile' (sửa), 'change_password' (đổi pass)
  const [mode, setMode] = useState("view"); 
  
  // State cho form sửa thông tin cá nhân
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    company_name: "",
    phone: "",
  });

  const [saving, setSaving] = useState(false);

  // Helper lấy token an toàn
  const getToken = () => {
    return localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
  };

  // Load dữ liệu khi vào trang
  useEffect(() => {
    if (!customer && isAuthenticated) {
      const token = getToken();
      if(token) fetchCustomer(token);
    } else if (customer) {
      setFormData({
        first_name: customer.first_name || "",
        last_name: customer.last_name || "",
        company_name: customer.metadata?.company || "",
        phone: customer.phone || "",
      });
    }
  }, [customer, isAuthenticated, fetchCustomer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 1️⃣ Xử lý Lưu Hồ Sơ (Edit Profile)
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return toast.warning("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");

    setSaving(true);
    try {
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        metadata: { company: formData.company_name }
      };

      const { data } = await apiCustomerClient.post("/customers/me", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data?.customer) {
        await fetchCustomer(token);
        setMode("view");
        toast.success("Cập nhật hồ sơ thành công! 🎉");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Lỗi cập nhật hồ sơ");
    } finally {
      setSaving(false);
    }
  };

  // 2️⃣ Xử lý Gửi Email Đổi Mật Khẩu (Change Password)
  

  const handleRequestPasswordReset = async () => {
    setSaving(true);
    try {
      await apiAuthClient.post("/customer/emailpass/reset-password", {
        identifier: customer.email,
      });

      // Thông báo nhẹ nhàng
      toast.success(`Đã gửi email xác nhận tới: ${customer.email}`);
      toast.info("Bạn có thể tiếp tục sử dụng web. Hãy kiểm tra email khi rảnh.");
      
      // Reset về chế độ xem, KHÔNG logout
      setMode("view"); 

    } catch (error) {
      console.error(error);
      toast.error("Không thể gửi yêu cầu. Vui lòng thử lại sau.");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <div className="profile-loading">Đang tải thông tin...</div>;
  if (!customer) return <div className="profile-empty">Vui lòng đăng nhập để xem hồ sơ.</div>;

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        {/* === SIDEBAR === */}
        <aside className="profile-sidebar">
          <div className="profile-avatar">
            {customer.first_name?.[0]?.toUpperCase() || customer.email?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="profile-sidebar-info">
            <div className="profile-name">{customer.first_name} {customer.last_name}</div>
            <div className="profile-email">{customer.email}</div>
          </div>
          
          <div className="sidebar-menu">
            <button 
              className={`menu-btn ${mode === 'view' || mode === 'edit_profile' ? 'active' : ''}`}
              onClick={() => setMode("view")}
            >
              Thông tin chung
            </button>
            <button 
              className={`menu-btn ${mode === 'change_password' ? 'active' : ''}`}
              onClick={() => setMode("change_password")}
            >
              Đổi mật khẩu
            </button>
          </div>
        </aside>

        {/* === CONTENT === */}
        <main className="profile-content">
          
          {/* --- VIEW MODE --- */}
          {mode === "view" && (
            <>
              <div className="profile-header">
                <h2>Hồ Sơ Của Tôi</h2>
                <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
              </div>
              <div className="profile-view">
                <div className="info-row"><span className="info-label">Họ tên:</span><span className="info-value">{customer.first_name} {customer.last_name}</span></div>
                <div className="info-row"><span className="info-label">Email:</span><span className="info-value">{customer.email}</span></div>
                <div className="info-row"><span className="info-label">SĐT:</span><span className="info-value">{customer.phone || "---"}</span></div>
                <div className="info-row"><span className="info-label">Công ty:</span><span className="info-value">{customer.metadata?.company || "---"}</span></div>
                
                <div className="profile-actions">
                  <button className="btn-edit" onClick={() => setMode("edit_profile")}>Chỉnh Sửa Thông Tin</button>
                </div>
              </div>
            </>
          )}

          {/* --- EDIT PROFILE MODE --- */}
          {mode === "edit_profile" && (
            <>
              <div className="profile-header">
                <h2>Chỉnh Sửa Hồ Sơ</h2>
              </div>
              <form className="profile-form" onSubmit={handleSaveProfile}>
                <div className="form-group-row">
                  <div className="form-group">
                    <label>Họ</label>
                    <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Tên</label>
                    <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Công ty</label>
                  <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={() => setMode("view")} disabled={saving}>Hủy</button>
                  <button type="submit" className="btn-save" disabled={saving}>{saving ? "Đang Lưu..." : "Lưu Thay Đổi"}</button>
                </div>
              </form>
            </>
          )}

          {/* --- CHANGE PASSWORD MODE (Gửi Email) --- */}
          {mode === "change_password" && (
            <>
              <div className="profile-header">
                <h2>Đổi Mật Khẩu</h2>
                <p>Để đảm bảo an toàn, quy trình đổi mật khẩu sẽ được thực hiện qua email xác thực.</p>
              </div>
              
              <div className="password-reset-container" style={{textAlign: 'center', padding: '40px 20px'}}>
                <div style={{marginBottom: '20px', color: '#374151', fontSize: '1rem'}}>
                  Hệ thống sẽ gửi một liên kết đặt lại mật khẩu đến email của bạn:
                  <br />
                  <strong style={{color: '#2563eb', fontSize: '1.2rem', display:'block', marginTop:'10px'}}>
                    {customer.email}
                  </strong>
                </div>
                
                <div style={{display: 'flex', gap: '15px', justifyContent: 'center'}}>
                  <button 
                    className="btn-cancel" 
                    onClick={() => setMode("view")} 
                    disabled={saving}
                  >
                    Quay lại
                  </button>
                  <button 
                    className="btn-save" 
                    onClick={handleRequestPasswordReset} 
                    disabled={saving}
                    style={{minWidth: '180px'}}
                  >
                    {saving ? "Đang Gửi..." : "Gửi Email Xác Nhận"}
                  </button>
                </div>
                
                <p style={{marginTop: '25px', fontSize: '0.85rem', color: '#6b7280'}}>
                  Sau khi nhận được email, hãy nhấp vào liên kết để thiết lập mật khẩu mới.
                </p>
              </div>
            </>
          )}

        </main>
      </div>
    </div>
  );
}