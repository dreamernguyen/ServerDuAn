import express from "express";
import { checkEmailDaTonTai, checkTheoDoi, dangKy, dangNhap, danhSachNguoiDung, huyTheoDoi, theoDoi, xemTrangCaNhan } from "../controllers/nguoiDungController.js";

const router = express.Router();

router.post("/dangKy", dangKy);
router.post("/dangNhap", dangNhap);
router.get("/danhSach",danhSachNguoiDung);
router.get("/xemTrangCaNhan/:id",xemTrangCaNhan);
router.post("/theoDoi", theoDoi);
router.post("/huyTheoDoi", huyTheoDoi);
router.get("/check/:email", checkEmailDaTonTai);

export default router;
