const express = require('express')
const _ = require('lodash')
const app = express()
const port = 3010

let users = []
let messages = []

app.all('/*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "X-Requested-With")
    next()
})

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/auth', (req, res) => {
    let userName = req.query.name

    if (userName) {
        let user = {
            id: users.length + 1,
            name: userName,
            ip: req.query.ip ?? 'localhost',
            onlineAt: Date.now(),
        }

        users.push(user)

        res.send(user)
    } else {
        res.send({
            error: 'You must provide user name',
        })
    }
})

app.get('/deauth', (req, res) => {
    let userId = req.query.userId

    let removed = _.remove(users, (user) => user.id == userId)

    if (!_.isEmpty(removed)) {
        users.splice(index, 1)
        res.send({
            message: 'Deauthorized',
            code: 'deauthorized',
        })
    } else {
        res.send({
            error: 'You must provide correct user id',
        })
    }
})

app.get('/users', (req, res) => {
    let userId = req.query.userId

    if (userId) {
        res.send(_.filter(users, (user) => user.id != userId))
    } else {
        res.send(users)
    }
})

app.get('/messages', (req, res) => {
    let opponentId = req.query.opponentId
    let userId = req.query.userId

    if (userId) {
        if (opponentId) {
            res.send(_.filter(messages, (message) => (
                (message.authorId == opponentId && message.recepientId == userId)
                || (message.authorId == userId && message.recepientId == opponentId)
            )))
        } else {
            res.send(messages)
        }
    } else {
        res.send({
            error: 'You must provide user id',
        })
    }
})

app.get('/messages/send', (req, res) => {
    let text = req.query.text
    let recepientId = req.query.recepientId
    let authorId = req.query.authorId

    if (!text) {
        res.send({
            error: 'You must provide message text',
        })
    } else if (!authorId) {
        res.send({
            error: 'You must provide author id',
        })
    } else if (!recepientId) {
        res.send({
            error: 'You must provide recepient id',
        })
    } else {
        let message = {
            id: messages.length + 1,
            text,
            recepientId,
            authorId,
            createdAt: Date.now(),
        }

        messages.push(message)

        let userIndex = _.findIndex(users, { id: authorId })

        // users.splice(userIndex, 1, {
        //     ...users[userIndex],
        //     onlineAt: Date.now(),
        // })

        res.send(message)
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
