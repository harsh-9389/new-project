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
    videoname:String
})
const UserScehma=new mongoose.Schema({
    idofvideo:String,
    phonenumber:Number,
    Name:String,
    location:String
})
const Video=new mongoose.model('videos',VideoSchema)
const User=new mongoose.model('userss',UserScehma)
const upload = multer({ dest: 'uploads/' });
var filename=''
app.get('/upload-video',async(req,res)=>{
    res.render('livestream')
})
app.post('/upload-video', upload.single('video'),async(req,res)=>{
    try{
    const source = await fs.createReadStream(req.file.path);
  const destination = await fs.createWriteStream(`videos/${req.file.filename}.mp4`);
  source.pipe(destination);
  let filename=req.file.filename
  const video=await new Video({
    videoname:req.file.filename,
  })
  console.log(filename)
  const video1=await video.save()
  res.redirect(`/user_details?success=1`)
    }catch(err){
        console.log(err)
    }
})
var id=''
app.get('/user_details',async(req,res)=>{
    console.log(req.query.success)
    id=req.params.id
    res.render('details')
})
app.post('/user_details',async(req,res)=>{
    try{
    console.log(req.query)
    const user=await new User({
        idofvideo:id,
        phonenumber:req.body.number,
        Name:req.body.Name
    })
    const user1=await user.save()
    res.redirect('/')}catch(err){
        console.log(err)
    }
})
app.listen(3000,()=>{
    console.log('server running')
})