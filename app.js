const express = require('express')
const mongoose = require (`mongoose`)
// const encrypt = require('mongoose-encryption');
//const md5 = require('md5')
const ejs = require('ejs')
const dotenv = require('dotenv')
const bcrypt = require(`bcrypt`)
const saltRounds = 10;


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

//userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

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

app.post('/register', (req,res)=>{
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        try {
            const newUser = new UserBank({
                email: req.body.email,
                password: hash
            })
            newUser.save().then(()=>console.log('user saved with success'))
            res.render('secrets')
            
        } catch (error) {
            console.log("Oops, algo deu errado ",error)
        }
    });
})

app.post('/login', async (req, res) => {
    const testEmail =  req.body.email
    const testPassword =  req.body.password
    try {
        isRegistered = await UserBank.findOne({email:testEmail}).exec()
        bcrypt.compare(testPassword, isRegistered.password, function(err, result) {
            result ? res.render('secrets') : res.send('<h2> Dados incorretos</h2>')
            console.log("o user é "+isRegistered.email)
        });

    } catch (error) {
        console.log("Oops, algo deu errado ",error)
    }
})

app.listen(4000, () => {
    console.log('Servidor Rodando na porta 4000')
})