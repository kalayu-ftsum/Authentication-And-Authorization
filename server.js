const express=require('express');
require('dotenv').config();
const {passport}=require('./utils/auth');

require('./utils/db');
const auth=require('./routes/auth');
const routes=require('./routes/index');

const app=express();

app.use(passport.initialize());
app.use(express.json());
app.use('/auth',auth);
app.use('/',routes);


const PORT=process.env.PORT;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});

