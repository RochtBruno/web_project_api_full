const User = require("../models/user");
const { hashPassword } = require("../utils/password.js")
const jwt = require("jsonwebtoken")
require("dotenv").config()

console.log(process.env.JWT_SECRET)

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ data: users });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ message: 'Erro interno ao buscar usuários' });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).orFail();
    res.status(200).json({ data: user });
  } catch (error) {
    if (error.name === 'DocumentNotFoundError') {
      return res.status(404).json({ message: `Usuário ${id} não encontrado` });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ message: `ID inválido: ${id}` });
    }
    console.error(`Erro ao buscar usuário ${id}:`, error);
    res.status(500).json({ message: 'Erro interno ao buscar usuário' });
  }
};

exports.checkUser = async(req, res) => {
  const { authorization } = req.headers
  if(!authorization){
    return res.status(401).json({error: "token não fornecido"})
  }
  const [,token] = authorization.split(" ")
  try {
    const isValid = jwt.verify(token, process.env.JWT_SECRET)
    if(!isValid){
      return res.status(401).json({error: "token invalid"})
    }
    const { id } = jwt.decode(token)
    const user = await User.findById(id)
    if(!user){
      return res.status(404).json({error : "Usuário não encontrado"})
    }
    return res.status(200).json({ data: {
      id: user._id,
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar
    }})
  } catch (error) {
    console.error(`Erro ao verificar token`, error);
    res.status(500).json({ message: 'Erro ao verificar token' });
  }
}

exports.createUser = async (req, res) => {
  try {
    const {email, password, name, about, avatar } = req.body;
    const newUser = await User.create({
      email,
      password: hashPassword(password), 
      name: "Jacques Cousteau", 
      about: "Explorer", 
      avatar: "https://practicum-content.s3.us-west-1.amazonaws.com/resources/moved_avatar_1604080799.jpg" });
    res.status(201).json({
      data:{
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        about: newUser.about,
        avatar: newUser.avatar,
      }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Dados inválidos ao criar usuário', details: error.message });
    }
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ message: 'Erro interno ao criar usuário' });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await User.findByCredentials({ email, password });
    if(user.error){
      return res.status(401).json({message: user.error});
    }
    const token = jwt.sign(user, process.env.JWT_SECRET,{
      expiresIn:"7d"
    })
    res.status(201).json({
       data: {
        id: user.id,
        token
      }
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
};

exports.updateUser = async(req,res) => {
  const userId = req.user.id
  const {name, about } = req.body;
  try{
    const updatedUser = await User.findByIdAndUpdate(userId,
      { name, about},
      {new:true,runValidators: true}).orFail()
      res.status(200).json({
        data: {
          id: updatedUser._id,
          email: updatedUser.email,
          name: updatedUser.name,
          about: updatedUser.about,
          avatar: updatedUser.avatar
        }
      })
  }catch(error){
    if (error.name === 'DocumentNotFoundError') {
      return res.status(404).json({ message: `Usuário com ID ${userId} não encontrado` });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Dados inválidos na atualização', details: error.message });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ message: `ID inválido: ${userId}` });
    }
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro interno ao atualizar usuário' });
  }
}

exports.updateAvatar = async(req,res) => {
  const userId = req.user.id;
  const {avatar} = req.body;

  try{
    const updatedAvatar = await User.findByIdAndUpdate(userId,
      {avatar},
      {new:true,runValidators:true}).orFail()
      res.status(200).json({
        data: {
          id: updatedAvatar._id,
          email: updatedAvatar.email,
          name: updatedAvatar.name,
          about: updatedAvatar.about,
          avatar: updatedAvatar.avatar
        }
      })
  }catch(error){
    if (error.name === 'DocumentNotFoundError') {
      return res.status(404).json({ message: `Usuário com ID ${userId} não encontrado` });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Dados inválidos na atualização', details: error.message });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ message: `ID inválido: ${userId}` });
    }
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro interno ao atualizar usuário' });
  }
}

