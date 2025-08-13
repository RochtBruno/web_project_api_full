const mongoose = require('mongoose')
const { validatePassword } = require("../utils/password.js")
const urlRegex = /^https?:\/\/(www\.)?[\w\-._~:/?#[\]@!$&'()*+,;=]+#?$/;

const userSchema = new mongoose.Schema({
  email:{
    type: String,
    required:true,
    unique:true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} não é um email válido!`
    }
  },
  password:{
    type: String,
    required: true,
    minlength: 8,
    select:false
  },
  name:{
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    validate: {
    validator: function(v) {
      return urlRegex.test(v);
    },
      message: props => `${props.value} is not a valid URL!`
    }
  }
})

userSchema.statics.findByCredentials = async function findByCredentials({email,password}){
  const user = await this.findOne({email}).select("+password");
  if(!user){
    return({error: `User ${email} and/or password not found`})
  }
  if(!validatePassword(password, user.password)){
    return({error: `invalid Credentials`})
  }

  return ({ id: user._id, name: user.name, about: user.about})
}

module.exports = mongoose.model('user',userSchema)