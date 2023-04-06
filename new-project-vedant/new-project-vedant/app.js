//import neccesary modules 
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
const FIRScehma=new mongoose.Schema({
    username:String,
    phone:String,
    issue:String,
    image:String
})
const Video=new mongoose.model('videos',VideoSchema)
const User=new mongoose.model('userss',UserScehma)
const FIR=new mongoose.model('FIRs',FIRScehma)
const upload = multer({ dest: 'uploadvideos/' });
const uploadfile=multer({dest:'uploadfiles/'})
const storage = multer.diskStorage({
    destination:function(req, file, cb){
        return cb(null, './new-project-vedant/public/img')
    },
    filename: function(req, file, cb){
        return cb(null, `${Date.now()}-${file.originalname}`);
    },
})

const uploadimage = multer({storage:storage}) ;

//setting ejs files

const css = path.join(__dirname, './public/css')
const img = path.join(__dirname, './public/img')
const js = path.join(__dirname, './public/js')

app.use(express.static(css))
app.use(express.static(img))
// app.use(express.static(js))

var filename=''
var idoduser=''

app.get('/upload-video',async(req,res)=>{
    idofuser=req.query.id
    res.render('livestream')
})
app.post('/upload-video', upload.single('video'),async(req,res)=>{
  const source = await fs.createReadStream(req.file.path);
  const destination =await fs.createWriteStream(__dirname+`/videos//${req.file.filename}.mp4`);
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
    const firs=await FIR.find({})
    console.log(video)
    video.forEach(async (model)=>{
        let videoid=model._doc.videoname
        const user= await User.findOne({_id:model._doc.idofuser})
        await data.push([videoid,user._doc.Name,user._doc.phonenumber,user._doc.date])
        if(data.length===video.length){
              console.log(data,video.length)
              console.log(firs)
              res.render('admin',{data:data,firs:firs})
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
})
app.get('/', (req, res)=>{
    res.render('home')
})
app.get('/complaint', (req, res)=>{
    res.render('complaint')
})
app.post('/complaint', uploadimage.array('proof', 10), async (req, res) => {
    const fir=await new FIR({
        username:req.body.name,
        phone:req.body.phone,
        issue:req.body.issue,
        image:req.files[0].filename
    })
    await fir.save() 
    res.redirect('/'); 
})
app.listen(3000,()=>{
    console.log('server running')
})