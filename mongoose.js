const mongoose = require('mongoose')

//// Setting Up the MongoDB Connection 
mongoose.set('strictQuery', true);

mongoose.connect("mongodb://127.0.0.1:27017/hack_36")
.then(()=>{
    console.log("mongodb connected"); 
})
.catch(()=>{
    console.log("failed to connect");
})
///////////////////