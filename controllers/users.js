const db = require('../db')

exports.getAllUsers = async (req, res) => {
    let { page, limit } = req.query
    page = parseInt(page)
    limit = parseInt(limit)

    page = page || 1
    limit = limit || 10

    let offset = (page - 1) * limit
    
    try {
        const result = await db.query(
            "SELECT * FROM users ORDER BY id LIMIT $1 OFFSET $2",
            [limit, offset]
        )
        const users = result.rows
        return res.status(200).json({
            data: users
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).send("Something went wrong. Please try again later.")
    }
}

exports.getUserById = async (req, res) => {
    try {
        const result = await db.query(
            "SELECT * FROM users WHERE id = $1",
            [req.params.id]
        )
        const user = result.rows[0]
        if (!user) {
            return res.status(404).send("User not found!")
        }
        return res.status(200).json({
            data: user
        })
    } catch (err) {
        console.log(err)
        return res.status(500).send("Something went wrong. Please try again later.")
    }
}

exports.editUser = async (req, res) => {
    let user = {}

    req.body.name ? user.name = req.body.name : user.name = req.profile.name
    req.body.email ? user.email = req.body.email : user.email = req.profile.email

    try {
        const result = await db.query(
            "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
            [user.name, user.email, req.params.id]
        )
        const updatedUser = result.rows[0]
        if (!updatedUser) {
            return res.status(404).send("User not found!")
        }
        return res.status(200).json({
            data: updatedUser
        })
    } catch (err) {
        console.log(err)
        return res.status(500).send("Something went wrong. Please try again later.")
    }
}

// Delete user by id
exports.deleteUser = async (req, res) => {
    try {
        const result = await db.query(
            "DELETE FROM users WHERE id = $1",
            [req.params.id]
        )
        return res.status(204).send()
    } catch (err) {
        console.log(err)
        return res.status(500).send("Something went wrong. Please try again later.")
    }
}
