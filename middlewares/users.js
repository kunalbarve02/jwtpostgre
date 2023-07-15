const db = require('../db')
const { expressjwt: expressJwt } = require('express-jwt')

exports.setProfile = async (req, res, next) => {
    try {
        const result = await db.query(
            "SELECT * FROM users WHERE id = $1",
            [req.params.id]
        )
        const user = result.rows[0]
        if (!user) {
            return res.status(404).send("User not found!")
        }
        req.profile = user
    } catch (err) {
        console.log(err)
        return res.status(500).send()
    }
    next()
}

exports.isSignedIn = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    userProperty: "auth"
})

exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile.id == req.auth.id
    if (!checker) {
        return res.status(403).send("ACCESS DENIED")
    }
    next()
}
