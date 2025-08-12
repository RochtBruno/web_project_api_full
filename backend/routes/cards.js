const express = require('express')
const router = express.Router()
const CardController = require("../controllers/cards")

router.get('/', CardController.getAllCards)
router.post('/', CardController.createCard)
router.delete('/:id', CardController.deleteCardById)
router.put('/:cardId/likes', CardController.likeCard)
router.delete('/:cardId/likes',CardController.dislikeCard)

module.exports = router