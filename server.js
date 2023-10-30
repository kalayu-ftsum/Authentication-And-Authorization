const express=require('express');
require('dotenv').config();
const {passport}=require('./utils/auth');


require('./utils/db');
const auth=require('./routes/auth');
const routes=require('./routes/index');
const admin=require('./routes/admin')

const app=express();

app.use(passport.initialize());
app.use(express.json());
app.use('/auth',auth);
app.use('/admin',admin)
app.use('/',routes);


const PORT=process.env.PORT;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});

