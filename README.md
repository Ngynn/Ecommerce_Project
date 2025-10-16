# Medusa Backend

Dự án này sử dụng [Medusa.js](https://docs.medusajs.com/) làm **headless commerce backend**.

## Yêu cầu hệ thống
Trước khi chạy backend, hãy cài đặt các công cụ sau:
- [Node.js](https://nodejs.org/) (phiên bản **>=16**)
- [npm](https://www.npmjs.com/) hoặc [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) (cài đặt local hoặc dùng dịch vụ cloud)
- [Redis](https://redis.io/) (dùng cho caching, queues)

---

## Cài đặt

Clone repository
```bash
git clone https://github.com/QuocB-HC/MedusaJS_Test.git
```

### Frontend

Cài dependencies
```bash
cd EcommerceProject
npm install
```

Truy cập server
```bash
npm start
```

### Backend

Cài dependencies
```bash
cd my-medusa-store
npm install
dos2unix start.sh
```

Cài đặt Docker
- Truy cập https://www.docker.com/products/docker-desktop/
- Tải Docker Desktop

Chạy docker
```bash
npm run docker:up
docker compose logs -f
```

Truy cập server
```bash
✔ Server is ready on port: 9000 – 3ms
info:    Admin URL → http://localhost:9000/app
```

Tạo tài khoản admin
```bash
docker compose run --rm medusa npx medusa user -e example.admin@gmail.com -p 123456
```

Chạy server cho payment vnpay và momopay
```bash
cd vnpay-api
node server.js
```
