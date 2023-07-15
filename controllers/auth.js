const db = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')

exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let {name, email, password} = req.body

    try {
        password = await bcrypt.hash(password, 10)

        let result
        try
        {
            result = await db.query(
                "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id,name,email",
                [name, email, password]
            )
        }
        catch(err)
        {
            console.log(err)
            return res.status(400).send("Bad request")
        }
        const user = result.rows[0]
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        })
        return res.status(201).json({
            data: {
                user: user,
                token: token
            }
        })
    } catch (err) {
        console.log(err)
        return res.status(500).send(
            "Something went wrong. Please try again later."
        )
    }
}

exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {email, password} = req.body
    try {
        const result = await db.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        )
        const user = result.rows[0]
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
            })
            return res.status(200).json({
                data: {
                    user: {
                        name:user.name,
                        email:user.email
                    },
                    token: token
                }
            })
        } else {
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send(
            "Something went wrong. Please try again later."
        )
    }
}
