const express = require('express')
const mongoose = require (`mongoose`)
const encrypt = require('mongoose-encryption');
const ejs = require('ejs')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/usersDb')

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

let UserBank = mongoose.model('users',userSchema)



app.get('/', (req, res) => {
    res.render('home')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', async(req,res)=>{
    try {
        const newUser = new UserBank({
            email: req.body.email,
            password: req.body.password
        })
        await newUser.save().then(()=>console.log('user saved'+newUser))
        res.render('secrets')
        
    } catch (error) {
        console.log("Oops, algo deu errado ",error)
    }
})

app.post('/login', async (req, res) => {
    try {
        const testEmail =  req.body.email
        const testPassword =  req.body.password
        isRegistered = await UserBank.findOne({email:testEmail, password: testPassword}).exec()
        isRegistered ? res.render('secrets') : res.send('<h2> Dados incorretos para logon</h2>')
    } catch (error) {
        console.log("Oops, algo deu errado ",error)
    }
})

app.listen(4000, () => {
    console.log('Servidor Rodando na porta 4000')
})