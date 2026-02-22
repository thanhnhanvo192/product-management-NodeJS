const express = require("express"); // Import thư viện Express
require("dotenv").config(); // Load biến môi trường từ file .env
const methodOverride = require("method-override"); // Import thư viện method-override để hỗ trợ HTTP verbs như PUT và DELETE

const routesAdmin = require("./routes/admin/index.route"); // Import các route cho admin
const routes = require("./routes/clients/index.route"); // Import các route cho client
const systemConfig = require("./configs/system");

const database = require("./configs/database");
const system = require("./configs/system");
database.connect();

const app = express(); // Tạo ứng dụng Express
const port = process.env.PORT;

app.use(methodOverride("_method")); // Sử dụng method-override để hỗ trợ HTTP verbs

app.set("views", "./views"); // Khai báo thư mục chứa các file giao diện
app.set("view engine", "pug"); // Thiết lập Pug làm template engine

// App local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// Routes
routesAdmin(app);
routes(app);

app.use(express.static("public")); // Thiết lập thư mục chứa file tĩnh

// Start server
app.listen(port, () => {
  console.log(`App is listening on ${port}`);
});
