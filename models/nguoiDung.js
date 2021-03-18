import mongoose from 'mongoose';

const nguoiDungSchema = mongoose.Schema(
  {
    avatar : {type : String, default : ""},
    email: { type: String, trim: true },
    sdt: { type: Number, required: true, trim: true },
    matKhau: { type: String, required: true },
    hoTen: { type: String, required: true, trim: true },
    tuoi: { type: Number, trim: true },
    diaChi: { type: String },
    dangTheoDoi: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NguoiDung',
      },
    ],
    duocTheoDoi: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NguoiDung',
      },
    ],
  },
  {
    timestamps: {
      createdAt: 'thoiGianTao',
      updatedAt: 'thoiGianCapNhat',
    },
  }
);

const NguoiDung = mongoose.model('NguoiDung', nguoiDungSchema, 'nguoiDung');

export default NguoiDung;
