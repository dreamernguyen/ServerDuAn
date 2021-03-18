import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { Server } from "socket.io";

import TinNhan from "./models/tinNhan.js";
import NguoiDung from "./models/nguoiDung.js";
import ThongBao from "./models/thongBao.js";
import BaiViet from "./models/baiViet.js";

import nguoiDungRouter from "./routers/nguoiDungRouter.js";
import matHangRouter from "./routers/matHangRouter.js";
import tinNhanRouter from "./routers/tinNhanRouter.js";
import baiVietRouter from "./routers/baiVietRouter.js";
import binhLuanRouter from "./routers/binhLuanRouter.js";
import thongBaoRouter from "./routers/thongBaoRouter.js";


const PORT = process.env.PORT || 5000;

const app = express();

const databaseURL =
  "mongodb+srv://nhannbt:nhanne@cluster0-hw1yh.mongodb.net/dbYoKaFo?retryWrites=true&w=majority";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//cài đặt điều hướng
app.use("/nguoiDung/", nguoiDungRouter);
app.use("/matHang", matHangRouter);
app.use("/tinNhan/", tinNhanRouter);
app.use("/baiViet/", baiVietRouter);
app.use("/binhLuan/", binhLuanRouter);
app.use("/thongBao/", thongBaoRouter);

app.get("/", (req, res) => {
  res.send("ok");
});
//kết nối đến database
mongoose
  .connect(databaseURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Đã kết nối đến MongoDb");
  })
  .catch((error) => {
    console.log("Lỗi kết nối đến database\n" + error);
  });

//socket.io
const server = app.listen(PORT, () => {
  console.log(`Đang chạy trên port ${PORT}`);
});

const io = new Server(server);
io.on("connection", (socket) => {
  console.log(`connect ${socket.id}`);

  socket.on("testab", (hihi) => {
    console.log("Đã kết nối thành công");
    console.log(hihi);
  });
  TinNhan.watch([{ $match: { operationType: "insert" } }]).on(
    "change",
    (change) => {
      console.log("Có tin nhắn mới");

      TinNhan.findOne({ _id: change.fullDocument._id })
        .populate("idNguoiGui idNguoiNhan")
        .then((rs) => {
          io.emit("tinNhan", rs);
        });
    }
  );

  NguoiDung.watch([{ $match: { operationType: "insert" } }]).on("change",(change)=>{
    console.log("Có người dùng mới")
    console.log(change)
    const thongBaoMoi = new ThongBao({
      idNguoiDung: change.fullDocument._id,
      idTruyXuat: change.fullDocument._id,
      loaiThongBao: "NguoiDungMoi",
      noiDung: "Chào mừng bạn đến với mạng xã hội Safaco",
    });
    thongBaoMoi.save();
    io.emit("thongBao", thongBaoMoi);
  })
  
  BaiViet.watch().on("change",(change)=>{
    console.log("Bài viết thay đổi")
    console.log(change)
    
  })

  socket.on("disconnect", () => {
    console.log(`disconnect ${socket.id}`);
  });
});
