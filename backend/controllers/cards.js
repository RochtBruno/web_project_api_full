const Card = require('../models/card')

exports.getAllCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(200).json({data: cards});
  } catch (error) {
    console.error('Erro ao buscar cards:', error);
    res.status(500).json({ message: 'Erro interno ao buscar cards' });
  }
};

exports.createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const owner = req.user.id;
    const newCard = await Card.create({ name, link, owner });
    res.status(201).json(newCard);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Dados inválidos ao criar card', details: error.message });
    }
    console.error('Erro ao criar card:', error);
    res.status(500).json({ message: 'Erro interno ao criar card' });
  }
};

exports.deleteCardById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCard = await Card.findByIdAndDelete(id).orFail();
    res.status(200).json({ message: "Card deletado com sucesso", card: deletedCard });
  } catch (error) {
    if (error.name === 'DocumentNotFoundError') {
      return res.status(404).json({ message: `Card com ID ${id} não encontrado` });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ message: `ID inválido: ${id}` });
    }
    console.error('Erro ao deletar card:', error);
    res.status(500).json({ message: 'Erro interno ao tentar deletar card' });
  }
};

exports.likeCard = async (req,res) => {
  const userId = req.user.id
  const { cardId } = req.params

  try {
    const updatedCard = await Card.findByIdAndUpdate(cardId,
      {$addToSet : {likes:userId}},
      { new: true }
    ).orFail()
    res.status(200).json({message: "Card recebeu like", updatedCard})
  } catch (error) {
    if (error.name === 'DocumentNotFoundError') {
      return res.status(404).json({ message: `Card com ID ${cardId} não encontrado` });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ message: `ID de card inválido: ${cardId}` });
    }
    console.error('Erro ao adicionar like:', error);
    res.status(500).json({ message: 'Erro interno ao adicionar like' });
  }
}


exports.dislikeCard = async (req,res) => {
  const userId = req.user.id
  const {cardId} = req.params

  try {
    const updatedCard = await Card.findByIdAndUpdate(cardId,
      {$pull: { likes: userId}},
      {new: true}
    ).orFail()

    res.status(200).json({message: "Like removido do card", updatedCard})
  } catch (error) {
    if (error.name === 'DocumentNotFoundError') {
      return res.status(404).json({ message: `Card com ID ${cardId} não encontrado` });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ message: `ID de card inválido: ${cardId}` });
    }
    console.error('Erro ao remover like:', error);
    res.status(500).json({ message: 'Erro interno ao remover like' });
  }
}
