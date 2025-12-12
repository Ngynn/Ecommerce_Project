// src/context/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { apiAuthClient, apiCustomerClient, apiStoreClient } from "../lib/medusa";

const AUTH_TOKEN_KEY = "medusa_auth_token";
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper: Lấy token từ storage
  const getToken = useCallback(() => {
    return localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
  }, []);

  // Helper: Lưu/Xóa token
  const setAuthToken = useCallback((token, rememberMe = true) => {
    // Xóa token cũ ở cả 2 nơi để tránh xung đột
    localStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_TOKEN_KEY);

    if (token) {
      if (rememberMe) {
        localStorage.setItem(AUTH_TOKEN_KEY, token); // Lưu lâu dài
      } else {
        sessionStorage.setItem(AUTH_TOKEN_KEY, token); // Lưu phiên hiện tại
      }
    }
  }, []);

  const getAuthHeaders = useCallback((token) => {
    const currentToken = token || getToken();
    return currentToken ? { Authorization: `Bearer ${currentToken}` } : {};
  }, [getToken]);

  // 🔹 CẬP NHẬT: Hàm logout điều hướng về trang login
  const logout = useCallback(() => {
    // 1. Xóa token và state
    setAuthToken(null);
    setIsAuthenticated(false);
    setCustomer(null);

    // 2. Điều hướng về trang đăng nhập
    // Sử dụng window.location.replace để thay thế lịch sử duyệt web (không back lại được trang cũ)
    // và reload lại trang để đảm bảo sạch state.
    if (window.location.pathname !== "/login") {
      window.location.replace("/login");
    }
  }, [setAuthToken]);

  const fetchCustomer = useCallback(
    async (token) => {
      try {
        const headers = getAuthHeaders(token);
        const response = await apiCustomerClient.get("/customers/me", {
          headers,
        });

        if (response.data.customer) {
          setCustomer(response.data.customer);
          setIsAuthenticated(true);
        } else {
          logout();
        }
      } catch (error) {
        console.error(
          "LỖI FETCH CUSTOMER:",
          error.response?.status,
          error.message
        );
        // Nếu lỗi 401 (Hết phiên/Token sai) -> Tự động logout và chuyển về login
        if (error.response?.status === 401) {
          logout();
        }
      } finally {
        setIsLoading(false);
      }
    },
    [getAuthHeaders, logout]
  );

  const login = async (email, password, rememberMe = false) => {
    try {
      const authResponse = await apiAuthClient.post("/customer/emailpass", {
        email,
        password,
      });
      const token = authResponse.data.token;

      console.log(`-> Đăng nhập thành công. Ghi nhớ: ${rememberMe}`);
      
      setAuthToken(token, rememberMe);
      await fetchCustomer(token);

      return { success: true };
    } catch (error) {
      console.error(
        "Login thất bại:",
        error.response?.data?.message || error.message
      );
      setAuthToken(null);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Đăng nhập thất bại (Kiểm tra kết nối/Mật khẩu)",
      };
    }
  };

  const register = async ({
    email,
    password,
    first_name,
    last_name,
    phone,
  }) => {
    try {
      // 1. Đăng ký Auth
      const authRegisterResponse = await apiAuthClient.post(
        "/customer/emailpass/register",
        { email, password }
      );
      const registerToken = authRegisterResponse.data.token;
      
      // Tạm thời lưu token để gọi API tạo profile
      setAuthToken(registerToken); 

      // 2. Tạo customer record Store
      const headers = {
        ...getAuthHeaders(registerToken),
        "x-publishable-api-key":
          apiStoreClient.defaults.headers?.common?.["x-publishable-api-key"] ||
          process.env.REACT_APP_MEDUSA_PUBLISHABLE_KEY,
      };

      const customerForm = { first_name, last_name, email, phone };
      await apiStoreClient.post("/customers", customerForm, { headers });

      // 3. Login lại để lấy session chuẩn
      const authLoginResponse = await apiAuthClient.post("/customer/emailpass", {
        email,
        password,
      });
      const loginToken = authLoginResponse.data.token;
      setAuthToken(loginToken);

      // 4. Update address (nếu cần)
      const addressPayload = { first_name, last_name, phone };
      await apiStoreClient.post(
        "/customers/me/addresses",
        addressPayload,
        { headers: getAuthHeaders(loginToken) }
      );

      // 5. Fetch info
      await fetchCustomer(loginToken);

      return { success: true };
    } catch (error) {
      console.error("Register failed:", error);
      setAuthToken(null);
      const serverData = error.response?.data;
      let serverMsg =
        serverData?.message ||
        (typeof serverData === "string" ? serverData : "Đăng ký thất bại.");
      return { success: false, error: serverMsg };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const res = await apiAuthClient.get("/customer/google");
      if (res.data?.location) {
        window.location.href = res.data.location;
        return;
      }
      const token = res.data?.token || (typeof res.data === "string" ? res.data : null);
      if (token) {
        setAuthToken(token);
        await fetchCustomer(token);
        return;
      }
      window.location.href = `${process.env.REACT_APP_MEDUSA_BACKEND_URL}/auth/customer/google`;
    } catch (err) {
      console.error("Lỗi Google login:", err);
      window.location.href = `${process.env.REACT_APP_MEDUSA_BACKEND_URL}/auth/customer/google`;
    }
  };

  useEffect(() => {
    const storedToken = getToken();
    if (storedToken) {
      fetchCustomer(storedToken);
    } else {
      setIsLoading(false);
    }
  }, [getToken, fetchCustomer]);

  const value = {
    isAuthenticated,
    customer,
    isLoading,
    login,
    register,
    logout,
    setAuthToken,
    fetchCustomer,
    loginWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? <div>Đang tải trạng thái người dùng...</div> : children}
    </AuthContext.Provider>
  );
};