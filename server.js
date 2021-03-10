import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import {Server} from 'socket.io';
import TinNhan from './models/tinNhan.js'
import NguoiDung from './models/nguoiDung.js'

import nguoiDungRouter from "./routers/nguoiDungRouter.js";
import matHangRouter from "./routers/matHangRouter.js";
import tinNhanRouter from "./routers/tinNhanRouter.js";
import baiVietRouter from "./routers/baiVietRouter.js";
import binhLuanRouter from "./routers/binhLuanRouter.js";

const PORT = process.env.PORT || 5000

const app = express();

const databaseURL =
  "mongodb+srv://nhannbt:nhanne@cluster0-hw1yh.mongodb.net/dbYoKaFo?retryWrites=true&w=majority";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//cài đặt điều hướng
app.use("/nguoiDung/", nguoiDungRouter);
app.use("/matHang", matHangRouter);
app.use("/tinNhan/", tinNhanRouter);
app.use("/baiViet/",baiVietRouter );
app.use("/binhLuan/",binhLuanRouter );

app.get('/',(req,res)=>{
  res.send("ok")
})
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
const server = app.listen(PORT,()=>{
  console.log(`Đang chạy trên port ${PORT}`)
})

const io = new Server(server);

io.on("connection", (socket) => {
  console.log(`connect ${socket.id}`);

  // socket.on("guiThongBao", (cb) => {
  //   console.log("ping");
  socket.on("testab",(hihi)=>{
    console.log("Nhàn đẹp trai quá")
    console.log(hihi)
    socket.id = hihi
    
  })
//   io.to(socket.id).emit("tinNhan", `Server nhắn cho ${socket.id}`);
  // io.emit("thongBao","Nhàn đẹp trai vl")
  TinNhan.watch().on('change',(change)=>{
    console.log('Something has changed')
    console.log(change.fullDocument)
    io.emit('tinNhan',change.fullDocument)
     
//     io.emit("thongBao","có tin nhắn mới")
})

  socket.on("disconnect", () => {
    console.log(`disconnect ${socket.id}`);
  });
});
