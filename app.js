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
app.get('/admin',async(req,res)=>{
    var data=[]
    const video=await Video.find({}).sort({date:-1})
    console.log(video)
    video.forEach(async (model)=>{
        let videoid=model._doc.videoname
        const user= await User.findOne({_id:model._doc.idofuser})
        await data.push([videoid,user._doc.Name,user._doc.phonenumber])
        if(data.length===video.length){
              console.log(data,video.length)
              res.render('admin',{data:data})
        }     
    })
    })
app.post('/admin/buttons',function(req,res){
    console.log(req.body.submit)
    res.redirect('/adminvideos?link='+req.body.submit)
})

app.get('/adminvideos',function(req,res){
    console.log(req.query.link)
    res.sendFile(__dirname+'\\videos\\'+req.query.link+'.mp4');
    // const filePath = path.join(__dirname, 'videos\\e1e1d851ffbff846f21f0edd2a7b6bde.mp4');
    // const stat = fs.statSync(filePath);
    // const fileSize = stat.size;
    // const range = req.headers.range;
    // const headers = {
    //     'Content-Length': fileSize,
    //     'Content-Type': 'video/mp4',
    //   };
    // res.writeHead(200, headers);
})
app.listen(3000,()=>{
    console.log('server running')
})