require("dotenv").config();

const express = require("express");
const morgan = require('morgan');
const cors = require('cors');
const corsConfig = require('./src/configs/cors.config');

const errorMiddleware = require("./src/middlewares/error.middleware");
const notFoundMiddleware = require("./src/middlewares/not-found.middleware");

const indexRoutes = require("./src/routes/index.routes");
const apiRoutes = require("./src/routes/api.routes");

const app = express();

// Middleware cors
app.use(cors(corsConfig));

// Middleware chuyển đổi dữ liệu request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware logger
app.use(morgan('dev'));

// Sử dụng các route
app.use("/", indexRoutes);
app.use("/api", apiRoutes);

// Middleware bắt lỗi chung
app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(process.env.PORT, () => console.log(`Server đang chạy trên port ${process.env.PORT}`));