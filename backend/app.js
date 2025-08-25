const express = require("express")
const userRouter = require('./routes/users')
const cardRouter = require('./routes/cards')
const mongoose = require("mongoose")
const { createUser, loginUser } = require("./controllers/users.js")
const db = process.env.MONGO_URI
const app = express()
const auth = require("./middleware/auth")
const cors = require("cors")
const { requestLogger, errorLogger } = require("./middleware/logger.js")
require("dotenv").config()

app.use(express.json())
app.use(cors())

mongoose.connect(db)
.then(() => console.log("connected to db"))
.catch(err => console.log("error while connecting to db: ",err))

app.use(requestLogger)

app.use("/users", auth ,userRouter)
app.use("/cards",auth, cardRouter)
app.post("/signup", createUser);
app.post("/signin",loginUser)

app.use(errorLogger)

app.use((req,res) => {
  res.status(404).json({message:"A solicitação não foi encontrada"})
})


app.listen(process.env.PORT,()=>{
  console.log("Servidor funcionando na porta ", process.env.PORT)
})
