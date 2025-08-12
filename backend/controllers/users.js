const User = require("../models/user");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ message: 'Erro interno ao buscar usuários' });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).orFail();
    res.status(200).json(user);
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

exports.createUser = async (req, res) => {
  try {
    const {email, password, name, about, avatar } = req.body;
    const newUser = await User.create({email,password, name, about, avatar });
    res.status(201).json(newUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Dados inválidos ao criar usuário', details: error.message });
    }
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ message: 'Erro interno ao criar usuário' });
  }
};

exports.updateUser = async(req,res) => {
  const userId = req.user._id
  const {name, about } = req.body;
  try{
    const updatedUser = await User.findByIdAndUpdate(userId,
      { name, about},
      {new:true,runValidators: true}).orFail()
      res.status(200).json({message: "usuário atualizado com sucesso",updatedUser})
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
  const userId = req.user._id;
  const {avatar} = req.body;

  try{
    const updatedAvatar = await User.findByIdAndUpdate(userId,
      {avatar},
      {new:true,runValidators:true}).orFail()
      res.status(200).json({message: "avatar de usuário atualizado com sucesso",updatedAvatar})
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

