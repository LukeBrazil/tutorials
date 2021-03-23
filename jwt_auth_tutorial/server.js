require('dotenv').config()

const express = require('express');
const app = express()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

app.use(express.json())

const users = [
    {
        username: "John"
    }
]

app.get('/users', (req, res) => {
    res.json(users)
})



app.post('/users', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        console.log(hashedPassword)
        const user = { username: req.body.username, password: hashedPassword }
        users.push(user)
        console.log(user)
        res.json({ message: 'USER ADDED' })
    } catch {
        res.status(500).json({ message: 'DIDNT WORK' })
    }


})


app.post('/login', async (req, res) => {
    const user = users.find(user => user.username === req.body.username)
    if (user == null) {
        return res.status(400).send('Cannot find user!')
    }

    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const userForToken = { username: user.username }
            const accessToken = jwt.sign(userForToken, process.env.ACCESS_TOKEN_SECRET)
            res.json({ accessToken: accessToken, user: user })
        } else {
            res.send('Not allowed!')
        }
    } catch {
        res.status(500).send('DIDNT WORK BRUH')
    }

})


app.listen(3000, () => {
    console.log('server running...')
})