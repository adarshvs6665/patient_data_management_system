const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const mongoConnection = (uri,app) =>{

mongoose.connect(uri, {useNewUrlParser:true, useUnifiedTopology:true})
.then((result)=>{
  app.listen(process.env.PORT, () => {
    console.log(`server started on ${process.env.PORT}`);
  });
})
.catch((err)=>{
  console.log(err)
})
}

module.exports = mongoConnection;