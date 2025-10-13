const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const cors = require("cors");
const url = require("url");
const https = require("https");

const app = express();

// ✅ Cho phép React frontend truy cập
app.use(
  cors({
    origin: "http://localhost:3000", // domain frontend
    methods: ["GET", "POST"],
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* =====================  VNPay Config  ===================== */
const vnp_TmnCode = "L9Z7VVA4"; // Mã website sandbox
const vnp_HashSecret = "L0HI68AA8NJ0JQRTSS2LRNKYFSKHT33J"; // Chuỗi bí mật sandbox
const vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
const vnp_ReturnUrl = "http://localhost:3000/vnpay-return"; // URL trả về sau thanh toán

// ✅ API tạo thanh toán VNPay
app.post("/create_payment", (req, res) => {
  try {
    const ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress;

    const date = new Date();
    const createDate = date
      .toISOString()
      .replace(/[-T:\.Z]/g, "")
      .slice(0, 14);

    const orderId = Math.floor(Math.random() * 1000000);
    const amount = req.body.amount || 20000;
    const orderInfo = req.body.orderInfo || "Thanh toán đơn hàng demo";

    let vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: vnp_TmnCode,
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: orderId.toString(),
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: "other",
      vnp_Amount: amount * 100, // VNPay yêu cầu x100
      vnp_ReturnUrl: vnp_ReturnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    const redirectUrl = new url.URL(vnp_Url);

    // Sắp xếp tham số theo thứ tự alphabet
    Object.keys(vnp_Params)
      .sort()
      .forEach((key) => {
        const value = vnp_Params[key];
        if (value !== null && value !== undefined && value !== "") {
          redirectUrl.searchParams.append(key, value.toString());
        }
      });

    // Chuỗi ký, thay %20 => +
    const signData = redirectUrl.searchParams.toString().replace(/%20/g, "+");

    // Tạo chữ ký HMAC
    const secureHash = crypto
      .createHmac("sha512", vnp_HashSecret)
      .update(signData, "utf-8")
      .digest("hex");

    // Thêm chữ ký vào URL
    redirectUrl.searchParams.append("vnp_SecureHash", secureHash);

    const paymentUrl = redirectUrl.href;
    res.json({ code: "00", message: "success", data: paymentUrl });
  } catch (err) {
    console.error("VNPay Error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* =====================  MoMo Config  ===================== */
const accessKey =
  process.env.MOMO_ACCESS_KEY || "F8BBA842ECF85";
const secretKey =
  process.env.MOMO_SECRET_KEY || "K951B6PE1waDMi640xX08PD3vg6EkVlz";
const partnerCode = process.env.MOMO_PARTNER_CODE || "MOMO";
const momoRedirectUrl =
  "http://localhost:3000/";
const ipnUrl =
  "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";

// ✅ API tạo thanh toán MoMo
app.post("/create-momo-payment", (req, res) => {
  try {
    const amount = req.body.amount || "50000";
    const orderInfo = req.body.orderInfo || "pay with MoMo";
    const requestType = "payWithMethod";
    const orderId = partnerCode + new Date().getTime();
    const requestId = orderId;
    const extraData = "";
    const autoCapture = true;
    const lang = "vi";

    const rawSignature =
      "accessKey=" +
      accessKey +
      "&amount=" +
      amount +
      "&extraData=" +
      extraData +
      "&ipnUrl=" +
      ipnUrl +
      "&orderId=" +
      orderId +
      "&orderInfo=" +
      orderInfo +
      "&partnerCode=" +
      partnerCode +
      "&redirectUrl=" +
      momoRedirectUrl +
      "&requestId=" +
      requestId +
      "&requestType=" +
      requestType;

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = JSON.stringify({
      partnerCode,
      partnerName: "Test",
      storeId: "MomoTestStore",
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl: momoRedirectUrl,
      ipnUrl: ipnUrl,
      lang,
      requestType,
      autoCapture,
      extraData,
      signature,
    });

    const options = {
      hostname: "test-payment.momo.vn",
      port: 443,
      path: "/v2/gateway/api/create",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
    };

    const momoReq = https.request(options, (momoRes) => {
      let data = "";
      momoRes.on("data", (chunk) => (data += chunk));
      momoRes.on("end", () => {
        try {
          const json = JSON.parse(data);
          res.json(json);
        } catch (e) {
          console.error("MoMo JSON Parse Error:", data);
          res.status(500).json({ error: "Invalid JSON from MoMo", raw: data });
        }
      });
    });

    momoReq.on("error", (e) => {
      console.error("MoMo Request Error:", e);
      res.status(500).json({ error: e.message });
    });

    momoReq.write(requestBody);
    momoReq.end();
  } catch (err) {
    console.error("MoMo Error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* =====================  Test route  ===================== */
app.get("/", (_, res) => res.send("🚀 Payment server is running"));

/* =====================  Start Server  ===================== */
const PORT = 8888;
app.listen(PORT, () =>
  console.log(`✅ Server chạy tại: http://localhost:${PORT}`)
);
