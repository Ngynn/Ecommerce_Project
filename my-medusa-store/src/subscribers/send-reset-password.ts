import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import nodemailer from "nodemailer";

export default async function handleSendResetPassword({
  event,
}: SubscriberArgs<Record<string, any>>) {
  if (!event || !event.data) {
    console.warn("⚠️ No event data received");
    return;
  }

  const { token, entity_id } = event.data as {
    token?: string;
    entity_id?: string;
  };

  const email = entity_id; //entity_id chính là email

  if (!email) {
    console.error("❌ No email found in event data:", event.data);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const resetUrl = `http://localhost:3000/reset-password?token=${token}&email=${email}`;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: "Thay đổi mật khẩu của bạn",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2563eb; text-align: center;">Yêu cầu Đặt lại Mật khẩu</h2>
          <p>Xin chào,</p>
          <p>Chúng tôi nhận được yêu cầu thay đổi mật khẩu cho tài khoản <strong>${email}</strong> tại Digitech Shop.</p>
          <p>Vui lòng nhấn vào nút bên dưới để tạo mật khẩu mới:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Đặt lại mật khẩu
            </a>
          </div>

          <p style="font-size: 13px; color: #666;">
            Hoặc sao chép đường dẫn này vào trình duyệt: <br/>
            <a href="${resetUrl}" style="color: #2563eb;">${resetUrl}</a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #999; text-align: center;">
            Nếu bạn không yêu cầu thay đổi này, vui lòng bỏ qua email này. Tài khoản của bạn vẫn an toàn.
          </p>
        </div>
      `,
    });

    console.log(`✅ Sent password reset email to: ${email}`);
  } catch (err) {
    console.error("❌ Error sending password reset email:", err);
  }
}

export const config: SubscriberConfig = {
  event: "auth.password_reset",
};