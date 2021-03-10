import TinNhan from '../models/tinNhan.js'
import mongoose from 'mongoose';


export async function nhanTin(req,res){
    const tinNhan = new TinNhan(req.body)
    try {
        await tinNhan.save()
        res.send({thongBao : "Đã tạo tin nhắn mới"});
        console.log('Đã tạo tin nhắn mới')
    } catch (error) {
        console.log(error)
    }
    
}
export async function danhSachTinNhan(req,res){
    await TinNhan.find().then((result) => {
      res.send(result)
      console.log('Danh sách tin nhắn')
    }).catch((err) => {
      res.send('Lỗi lấy danh sách tin nhắn')
    });
  }

  

export async function danhSachLienHe(req,res){
  const idNguoiDung = mongoose.Types.ObjectId(req.params.id)
  // const list = await TinNhan.aggregate([
  //   { $match: { $or: [ { idNguoiGui: idNguoiDung }, { idNguoiNhan: idNguoiDung } ] } },
  //   { $group: { _id: { "nguoiGui":"$idNguoiGui","nguoiNhan":"$idNguoiNhan"} } },    
  // ] )
  
  // res.send(list)
  
  // res.send(abc)
  await TinNhan.find({ $or: [ { idNguoiGui: idNguoiDung }, { idNguoiNhan: idNguoiDung } ] }).select('idNguoiNhan idNguoiGui').populate('idNguoiNhan idNguoiGui','hoTen').then((result) => {
     var mang = []
    result.forEach(element => {
      if(!mang.includes(element.idNguoiGui)){
        mang = mang.concat(element.idNguoiGui)
        console.log("chưa có người gửi")
        if(!mang.includes(element.idNguoiNhan)){
          mang = mang.concat(element.idNguoiNhan)
          console.log("chưa có người nhận")
        }
      }else{
        console.log("Có rồi")
      }
    });
    var b = Array.from(new Set(mang.map(JSON.stringify)))
    // console.log(Object.values(mang[0]._id))
    let mangCuoi = b.map(i =>{
      return JSON.parse(i)
    })
    mangCuoi.forEach((value,index)=>{
      value._id == idNguoiDung ? mangCuoi.splice(index,1) : null
    })
    console.log(mangCuoi)
    res.send(mangCuoi)
  }).catch((err) => {
    console.log(err)
  });

  
  
}
export async function troChuyen(req,res){
  const idNguoi1 = req.body.idNguoi1;
  const idNguoi2 = req.body.idNguoi2;
  console.log(idNguoi1)
  console.log(idNguoi2)
  const a = {$and :
    [{ $or: [ { idNguoiGui: idNguoi1 }, { idNguoiNhan: idNguoi1 } ] },
    { $or: [ { idNguoiGui: idNguoi2 }, { idNguoiNhan: idNguoi2 } ] }
  ]
  }
  await TinNhan.find(a).populate('idNguoiGui idNguoiNhan').then(rs =>{
    res.send(rs)
  })
}
