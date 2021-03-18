import NguoiDung from "../models/nguoiDung.js";
import BaiViet from "../models/baiViet.js";
import QRCode from 'qrcode'

export async function dangKy(req, res) {
  const nguoiDungMoi = new NguoiDung(req.body);
  try {
    if (await NguoiDung.findOne({ sdt: req.body.sdt })) {
      res.send({
        thongBao: 'Số điện thoại này đã được đăng ký'
      });
    } else {
      await nguoiDungMoi.save();
      res.send({
        thongBao: `Đăng ký thành công với ${req.body.hoTen}`,
      });
      console.log(nguoiDungMoi);
    }
  } catch (err) {
    console.log(err);
  }
}

export async function dangNhap(req, res) {
  const {sdt,matKhau} = req.body
  try {
    const nguoiDung = await NguoiDung.findOne({sdt : sdt})
    if (nguoiDung) {
      if(matKhau == nguoiDung.matKhau){
        res.send({
          thongBao: `Đăng nhập thành công !`,
          nguoiDung : nguoiDung
        });
      }else if(matKhau != nguoiDung.matKhau){
        res.send({
          thongBao: `Sai mật khẩu !`,
        });
      }
    } else {
      res.send({
        thongBao: `Tài khoản không tồn tại !`,
      });
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
}

export async function danhSachNguoiDung(req,res){

  await NguoiDung.find().then(async(nguoiDung) => {
    if(nguoiDung){
      res.send(nguoiDung)
    }else{
      res.send('Người dùng không tồn tại')
    }
  }).catch((err) => {
    res.send('Lỗi lấy danh sách người dùng')
  });
}
export async function xemTrangCaNhan(req, res) {
  try {
    const nguoiDung = await NguoiDung.findById(req.params.id);
    if(nguoiDung){
      const danhSach = await BaiViet.find({idNguoiDung: req.params.id, trangThai: true})
      .populate('idNguoiDung luotThich');
     
        res.send({
          nguoiDung : nguoiDung,
          danhSachBaiViet: danhSach
        })
      
    }else{
        res.send({thongBao : "Không tìm thấy người dùng"})
    }
  } catch (error) {
    console.log(error)
  }
}

export async function theoDoi(req, res) {

  try {
    const nguoiTheoDoi = await NguoiDung.findById(req.body.idNguoiTheoDoi);
    const nguoiDuocTheoDoi = await NguoiDung.findById(req.body.idNguoiDuocTheoDoi);
    if(nguoiTheoDoi){
      console.log(`Người theo dõi :${nguoiTheoDoi.hoTen}`)
      if(nguoiDuocTheoDoi){
        console.log(`Người theo dõi :${nguoiDuocTheoDoi.hoTen}`)
        await NguoiDung.updateOne({_id : nguoiTheoDoi._id},{$push : {dangTheoDoi : nguoiDuocTheoDoi}});
        await NguoiDung.updateOne({_id : nguoiDuocTheoDoi._id},{$push : {duocTheoDoi : nguoiTheoDoi}});
        res.send({thongBao : `Theo dõi thành công ${nguoiDuocTheoDoi.hoTen}`})
      }
      else{
        console.log('Không tìm thấy người được theo dõi')
        res.send({thongBao : 'Không tìm thấy người được theo dõi' })
      }
    }else{
      console.log('Không tìm thấy người theo dõi')
      res.send({thongBao : 'Không tìm thấy người theo dõi' })
    }
  } catch (error) {
    console.log(error)
  }

}

export async function huyTheoDoi(req, res) {

  try {
    const nguoiTheoDoi = await NguoiDung.findById(req.body.idNguoiTheoDoi);
    const nguoiDuocTheoDoi = await NguoiDung.findById(req.body.idNguoiDuocTheoDoi);
    if(nguoiTheoDoi){
      console.log(`Người theo dõi :${nguoiTheoDoi.dangTheoDoi}`)
      if(nguoiDuocTheoDoi){
        console.log(`Người theo dõi :${nguoiDuocTheoDoi.hoTen}`)
        await NguoiDung.updateOne({_id : nguoiTheoDoi._id},{$pull : {dangTheoDoi : nguoiDuocTheoDoi._id}});
        await NguoiDung.updateOne({_id : nguoiDuocTheoDoi._id},{$pull : {duocTheoDoi : nguoiTheoDoi._id}});
        res.send({thongBao : `Hủy theo dõi thành công ${nguoiDuocTheoDoi.hoTen}`})
      }
      else{
        console.log('Không tìm thấy người được theo dõi')
        res.send({thongBao : 'Không tìm thấy người được theo dõi' })
      }
    }else{
      console.log('Không tìm thấy người theo dõi')
      res.send({thongBao : 'Không tìm thấy người theo dõi' })
    }
  } catch (error) {
    console.log(error)
  }

}

export async function checkTheoDoi(req, res) {

  // try {
  //   const nguoiTheoDoi = await NguoiDung.findById(req.body.idNguoiTheoDoi);
  //   const nguoiDuocTheoDoi = await NguoiDung.findById(req.body.idNguoiDuocTheoDoi);
  //   if(nguoiTheoDoi){
  //     if(nguoiDuocTheoDoi){
  //       const rs = await NguoiDung.findOne({_id : nguoiDuocTheoDoi._id,duocTheoDoi : {$all : nguoiTheoDoi._id}});
  //       if(rs){
  //         console.log(rs)
  //         res.send({thongBao : `Đã theo dõi ${nguoiDuocTheoDoi.hoTen} rồi`})
  //       }else{
  //         res.send({thongBao : `Chưa theo dõi ${nguoiDuocTheoDoi.hoTen} `})
  //       }
        
  //     }
  //     else{
  //       console.log('Không tìm thấy người được theo dõi')
  //       res.send({thongBao : 'Không tìm thấy người được theo dõi' })
  //     }
  //   }else{
  //     console.log('Không tìm thấy người theo dõi')
  //     res.send({thongBao : 'Không tìm thấy người theo dõi' })
  //   }
  // } catch (error) {
  //   console.log(error)
  // }
  var opts = {
    errorCorrectionLevel: 'H',
    type: 'image/jpeg',
    quality: 0.3,
    margin: 1,
    color: {
      dark:"#010599FF",
      light:"#FFBF60FF"
    }
  }
  QRCode.toDataURL('Dreamer', opts, function (err, url) {
    if (err) throw err
    res.send(url)
  })

}

export async function checkEmailDaTonTai(req,res){
  try {
    const nguoiDung = await NguoiDung.findOne({email : req.params.email})
    res.send({nguoiDung : nguoiDung})
  } catch (error) {
    console.log(error)
  }
}