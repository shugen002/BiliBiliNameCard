var fs=require("fs");
var express = require('express');
var router = express.Router();
var axios =require("axios");
const { createCanvas, loadImage,Image } = require('canvas')
var publicimage = new Image();
publicimage.src=fs.readFileSync("./哔日头条.jpg");
/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).sendFile("index.html").end();
});
router.get("/roomCard/:roomId",function(req,res){
  var roomId=parseInt(req.params.roomId);
  var username="";
  var canvas;
  var ctx;
  axios.get("https://api.live.bilibili.com/room/v1/Room/room_init",{params:{id:parseInt(req.params.roomId)}})
    .then((result)=>{
      if(result.data.data && result.data.data.uid){
        roomId=result.data.data.short_id==0?roomId:result.data.data.short_id;
        return axios.get("https://api.bilibili.com/x/web-interface/card",{params:{mid:result.data.data.uid}})
      }else{
        throw result;
      }
    }).then((result)=>{
      if(result.data.data && result.data.data.card && result.data.data.card.name){
        username=result.data.data.card.name;
      }else{
        throw result;
      }
      if(result.data.data && result.data.data.card && result.data.data.card.face){
        return loadImage(result.data.data.card.face)
      }else{
        throw result ;
      }
    }).then((image)=>{
      var canvas=createCanvas(960,428);
      var ctx=canvas.getContext("2d");
      var canvas2=createCanvas(280,280);
      var ctx2 = canvas2.getContext("2d");
      ctx2.beginPath();
      ctx2.arc(140, 140, 140, 0, Math.PI * 2, true);
      ctx2.closePath();
      ctx2.clip();
      ctx2.drawImage(image, 0, 0, 280, 280);
      ctx.drawImage(publicimage, 0, 0);
      ctx.drawImage(canvas2, 68, 76);
      ctx.save();
      ctx.fillStyle = "rgb(113,129,200)";
      ctx.font = "bold 68px 'Arial,Microsoft YaHei,Microsoft Sans Serif,Microsoft SanSerf,微软雅黑'";
      ctx.fillText(username, 390, 248);
      ctx.restore();
      ctx.save();
      ctx.fillStyle = "rgb(113,129,200)";
      ctx.font = "48px 'Arial,Microsoft YaHei,Microsoft Sans Serif,Microsoft SanSerf,微软雅黑'";
      ctx.fillText("RoomID: " + roomId, 390, 324);
      ctx.restore();
      res.status(200).set('Content-Type',"image/jpeg").send(canvas.toBuffer("image/jpeg")).end();
    }).catch((e)=>{
      console.log(e);
      res.status(500).end();
    })

})

module.exports = router;
