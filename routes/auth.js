const express = require('express')
const { register, login } = require('../controllers/auth')
const router = express.Router()
const { check } = require("express-validator")

router.post('/auth/register',
    //validation using express-validator
    [
        check("name", "name should be at least 3 char").exists().isLength({ min: 3 }),
        check("email", "email is required").exists().isEmail(),
        check("password", "password should be at least 8 char").exists().isLength({ min: 8 }),
    ],
  register
)
router.post('/auth/login',
    //validation using express-validator
    [
        check("email", "email is required").exists().isEmail(),
        check("password", "password should be at least 8 char").exists().isLength({ min: 8 }),
    ]
    ,login
)

module.exports = router
