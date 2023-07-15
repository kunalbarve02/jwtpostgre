const express = require('express')
const router = express.Router()
const db = require('../db')
const { isSignedIn, isAuthenticated, setProfile } = require('../middlewares/users')
const { getAllUsers, editUser, getUserById, deleteUser } = require('../controllers/users')

//params
router.param("id", setProfile)

//routes
router.get('/users', isSignedIn, getAllUsers)
router.get('/users/:id', isSignedIn, getUserById)
router.put('/users/:id', isSignedIn,isAuthenticated, editUser)
router.delete('/users/:id', isSignedIn,isAuthenticated, deleteUser)

module.exports = router
