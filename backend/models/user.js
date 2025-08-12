const mongoose = require('mongoose')
const urlRegex = /^https?:\/\/(www\.)?[\w\-._~:/?#[\]@!$&'()*+,;=]+#?$/;

const userSchema = new mongoose.Schema({
  email:{
    type: String,
    required:true,
    unique:true
  },
  password:{
    type: String,
    required: true,
    minlength: 8
  },
  name:{
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true
  },
  avatar: {
    type: String,
    required: true,
    validate: {
    validator: function(v) {
      return urlRegex.test(v);
    },
      message: props => `${props.value} is not a valid URL!`
    }
  }
})

module.exports = mongoose.model('user',userSchema)