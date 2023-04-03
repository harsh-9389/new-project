const express = require('express'); 
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
// const upload = multer({dest: "uploads/"})

const storage = multer.diskStorage({
    destination:function(req, file, cb){
        return cb(null, './uploads')
    },
    filename: function(req, file, cb){
        return cb(null, `${Date.now()}-${file.originalname}`);
    },
})

var upload = multer({storage: storage}) ;

//setting ejs files
const app = express();
app.set('view engine', 'ejs'); 
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}))

const css = path.join(__dirname, './public/css')
const img = path.join(__dirname, './public/img')
const js = path.join(__dirname, './public/js')

app.use(express.static(css))
app.use(express.static(img))
app.use(express.static(js))
///////////////

/////Routes/////
app.get('/', (req, res)=>{
    res.render('home')
})

app.get('/complaint', (req, res)=>{
    res.render('complaint')
})
/////////////////

//////Setting Post Methods/////
app.post('/complaint', upload.array('proof', 10), (req, res) => {
    console.log(req.body); 
    console.log(req.files); 

    return res.redirect('/complaint'); 
})


/// Setting up the server/////
const port = process.env.PORT || 3000; 
app.listen(port, (err) => {
    if(err){
        console.log('error in server setup.'); 
    }
    else{
        console.log(`Server is listening at port ${port}`); 
    } 
})
/////////////////////