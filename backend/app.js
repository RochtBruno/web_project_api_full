const express = require("express")
const userRouter = require('./routes/users')
const cardRouter = require('./routes/cards')
const mongoose = require("mongoose")
require("dotenv").config()

const db = process.env.MONGO_URI
const app = express()
const PORT = 3000

app.use(express.json())
app.use((req, res, next) => {
  req.user = {
    _id: '685344c22129cdc75e7cb775'
  };
  next();
});

mongoose.connect(db)
.then(() => console.log("connected to db"))
.catch(err => console.log("error while connecting to db: ",err))

app.use("/users",userRouter)
app.use("/cards",cardRouter)


app.use((req,res) => {
  res.status(404).json({message:"A solicitação não foi encontrada"})
})


app.listen(PORT,()=>{
  console.log("Servidor funcionando na porta ",PORT)
})
