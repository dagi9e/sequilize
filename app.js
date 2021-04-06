const express = require('express')
const cookieParser = require("cookie-parser")
const { v4: uuidv4 } = require('uuid');
const matchCredentials = require('./utils.js')
const { User } = require('./fake_models.js')
const app = express()

app.set('view engine', 'ejs')
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))


// show home with forms
app.get('/', function(req, res) {
    res.render('pages/home')
})

////////////////////////////////////////////////

//here is the part I have adjusted, specific for Week 12 Assignment where we send the data to fake_models.js
// create a user account
app.post('/create', function(req, res) {
    const user = await User.create({
        username: body.username,
        password: body.password
    });​
    console.log(user.toJSON())
    res.send('=)')
    res.redirect('/')
})

///////////////////////////////////////////////////////////


// login
let global_id = 0; //this global variable will later be used to hold the current session unique ID
app.post('/login', function(req, res) {
    if (matchCredentials(req.body)) {
        let user = fake_db.users[req.body.username]
        let id = uuidv4()
        global_id = id;
        fake_db.sessions[id] = {
                user: user,
                timeOfLogin: Date.now()
            }
            // create cookie that holds the UUID (the Session ID)
        res.cookie('SID', id, {
            expires: new Date(Date.now() + 900000),
            httpOnly: true
        })
        res.render('pages/members')
    } else {
        res.redirect('/error')
    }
})

// this is the protected route
app.get('/supercoolmembersonlypage', function(req, res) {
    let id2 = req.cookies.SID
    let session = fake_db.sessions[id2]
    if (session) {
        res.render('pages/members')
    } else {
        res.render('pages/error')
    }
})

//the line of code below is the solution to the challenge
app.get('/clc', function(req, res) {
    res.cookie('SID', null, {
        expires: new Date(Date.now() - 900000),
        httpOnly: true
    })
    delete fake_db.sessions.global_id //global_id varriable is the copy of the unique id created by uuidv4()
    res.render('pages/home')
})

// if something went wrong, you get sent here
app.get('/error', function(req, res) {
    res.render('pages/error')
})

// 404 handling
app.all('*', function(req, res) {
    res.render('pages/error')
})

app.listen(1612)
console.log('running')