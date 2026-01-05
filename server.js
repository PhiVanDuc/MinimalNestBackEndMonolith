require("dotenv").config();

const express = require("express");
const http = require("http");
const morgan = require('morgan');
const cors = require('cors');
const corsConfig = require('./src/configs/cors.config');
const passportConfig = require('./src/configs/passport.config');

const errorMiddleware = require("./src/middlewares/error.middleware");
const notFoundMiddleware = require("./src/middlewares/not-found.middleware");
const trimMiddleware = require("./src/middlewares/trim.middleware");

const indexRoute = require("./src/routes/index.route");
const apiRoute = require("./src/routes/api.route");

const app = express();
const server = http.createServer(app);

// Middleware cors
app.use(cors(corsConfig));

// Middleware chuyển đổi dữ liệu request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(trimMiddleware);

// Middleware logger
app.use(morgan('dev'));

// Sử dụng passport
app.use(passportConfig.initialize());

// Sử dụng các route
app.use("/", indexRoute);
app.use("/api", apiRoute);

// Middleware bắt lỗi chung
app.use(notFoundMiddleware);
app.use(errorMiddleware);

server.listen(process.env.PORT, () => console.log(`Server đang chạy trên port ${process.env.PORT}`));