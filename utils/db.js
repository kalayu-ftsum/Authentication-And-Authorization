const mongoose=require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.db)
.then(msg=>console.log('database connected!'))
.catch(err=> console.log(`Error connecting database ${err}`));