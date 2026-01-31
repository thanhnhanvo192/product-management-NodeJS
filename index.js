const express = require("express"); // Import thư viện Express
const routes = require("./routes/clients/index.route"); // Import các route cho client

const app = express(); // Tạo ứng dụng Express
const port = 3000;

app.set("views", "./views"); // Khai báo thư mục chứa các file giao diện
app.set("view engine", "pug"); // Thiết lập Pug làm template engine

// Routes
routes(app);

app.listen(port, () => {
  console.log(`App is listening on ${port}`);
});
