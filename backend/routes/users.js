const express = require('express')
const router = express.Router()
const UserController = require('../controllers/users')

router.get("/", UserController.getAllUsers)
router.get("/me", UserController.checkUser)
router.get("/:id", UserController.getUserById)
router.post("/signup", UserController.createUser)
router.post("/login", UserController.loginUser)
router.patch("/me", UserController.updateUser)
router.patch("/me/avatar", UserController.updateAvatar)

module.exports = router