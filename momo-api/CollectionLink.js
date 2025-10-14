const express = require("express");
const crypto = require("crypto");
const https = require("https");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

// 🔑 Bật CORS cho React (3000)
app.use(cors({ origin: "http://localhost:3000" }));

app.use(bodyParser.json());

// ---- Thông tin MoMo ----
const accessKey = process.env.MOMO_ACCESS_KEY || "F8BBA842ECF85";
const secretKey = process.env.MOMO_SECRET_KEY || "K951B6PE1waDMi640xX08PD3vg6EkVlz";
const partnerCode = process.env.MOMO_PARTNER_CODE || "MOMO";
const redirectUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
const ipnUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";

app.post("/create-momo-payment", (req, res) => {
  const amount = req.body.amount || "50000";
  const orderInfo = req.body.orderInfo || "pay with MoMo";
  const requestType = "payWithMethod";
  const orderId = partnerCode + new Date().getTime();
  const requestId = orderId;
  const extraData = "";
  const autoCapture = true;
  const lang = "vi";

  const rawSignature =
    "accessKey=" + accessKey +
    "&amount=" + amount +
    "&extraData=" + extraData +
    "&ipnUrl=" + ipnUrl +
    "&orderId=" + orderId +
    "&orderInfo=" + orderInfo +
    "&partnerCode=" + partnerCode +
    "&redirectUrl=" + redirectUrl +
    "&requestId=" + requestId +
    "&requestType=" + requestType;

  const signature = crypto.createHmac("sha256", secretKey)
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
    redirectUrl,
    ipnUrl,
    lang,
    requestType,
    autoCapture,
    extraData,
    signature
  });

  const options = {
    hostname: "test-payment.momo.vn",
    port: 443,
    path: "/v2/gateway/api/create",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(requestBody)
    }
  };

  const momoReq = https.request(options, momoRes => {
    let data = "";
    momoRes.on("data", chunk => data += chunk);
    momoRes.on("end", () => {
      try {
        res.json(JSON.parse(data));
      } catch (e) {
        res.status(500).json({ error: "Invalid JSON from MoMo", raw: data });
      }
    });
  });

  momoReq.on("error", e => res.status(500).json({ error: e.message }));
  momoReq.write(requestBody);
  momoReq.end();
});

app.get("/", (_, res) => res.send("MoMo Express server is running 🚀"));

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
