const express = require("express"); // Import thư viện Express
require("dotenv").config(); // Load biến môi trường từ file .env

const routesAdmin = require("./routes/admin/index.route"); // Import các route cho admin
const routes = require("./routes/clients/index.route"); // Import các route cho client

const database = require("./configs/database");
database.connect();

const app = express(); // Tạo ứng dụng Express
const port = process.env.PORT;

app.set("views", "./views"); // Khai báo thư mục chứa các file giao diện
app.set("view engine", "pug"); // Thiết lập Pug làm template engine

// Routes
routesAdmin(app);
routes(app);

app.use(express.static("public")); // Thiết lập thư mục chứa file tĩnh

// Start server
app.listen(port, () => {
  console.log(`App is listening on ${port}`);
});
