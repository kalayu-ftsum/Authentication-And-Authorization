const express=require('express');
const routers=require('./routes/index')

const app=express();

app.use('/',routers)


const PORT=3000;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})