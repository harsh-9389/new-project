const express=require('express')
const bodyParser=require('body-parser')
const multer = require('multer');
const app=express()
const fs = require('fs');
const path=require('path')
const mongoose=require("mongoose")
app.set('views', path.join(__dirname, 'views'))
app.use(express.static('public'))
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
mongoose.set("strictQuery", false);
mongoose.connect('mongodb://localhost:27017/shopDB',{useNewURLParser:true,useUnifiedTopology: true, family: 4}).then(()=>{
    console.log('connected')
})
const VideoSchema=new mongoose.Schema({
    idofuser:String,
    videoname:String,
    date:Number
})
const UserScehma=new mongoose.Schema({
    phonenumber:Number,
    Name:String,
    date:Number
})
const Video=new mongoose.model('videos',VideoSchema)
const User=new mongoose.model('userss',UserScehma)
const upload = multer({ dest: 'uploads/' });
const uploadfile=multer({dest:'uploadfiles/'})
var filename=''
var idoduser=''
app.get('/upload-video',async(req,res)=>{
    idofuser=req.query.id
    res.render('livestream')
})
app.post('/upload-video', upload.single('video'),async(req,res)=>{
  const source = await fs.createReadStream(req.file.path);
  const destination =await fs.createWriteStream(`videos/${req.file.filename}.mp4`);
  source.pipe(destination);
  let filename=req.file.filename
  const video=await new Video({
    idofuser:idofuser,
    videoname:filename,
    date:Date.now()
  })
  const video1=await video.save()
  res.redirect("/")
})
app.get('/user_details',async(req,res)=>{
    res.render('details')
})
app.post('/user_details',uploadfile.single('text'),async(req,res)=>{
    try{
        console.log(req)
    const user=await new User({
        phonenumber:req.body.number,
        Name:req.body.Name,
        date:Date.now()
    })
    const user1=await user.save()
    res.redirect('upload-video/?id='+user._id)}catch(err){
        console.log(err)
    }
})

app.get('/admin',function(req,res){
    Video.find({}).sort({ date: -1 }).then((result)=>{
        var data=[]
        data.push(1)
        result.forEach(function(model){
            data.push(1)
            let videoid=model._doc.videoname
            User.findOne({_id:model._doc.idofuser}).then((result1)=>{
                data.push(1)
                data.push([videoid,result1[0]._doc.Name,result1[0]._doc.phonenumber])
            })
        })
            console.log(data)
            res.render('admin',{data:data})
        })
    })
app.get('/adminvideos',function(req,res){
    const videolink=req.query.link
    const filePath = path.join(__dirname, 'videos\\3bb18b0011ab1d58cede99e0a8aa0d93.mp4');
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;
    const headers = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
    res.writeHead(200, headers);
})
app.listen(3000,()=>{
    console.log('server running')
})