const express = require('express')
const  expressLayouts = require ('express-ejs-layouts')
const mongoose = require('mongoose')
const app = express()


//connect mongo
mongoose.connect(db,{useNewUrlParser:true})
.then(() => console.log("connected to mongoDB...."))
.catch(err => console.log(err))

// EJS
app.use(expressLayouts)
app.set('view engine', 'ejs');

//Body-parser 
app.use(express.urlencoded({extended: false}))

app.use('/', require('./routes/index'))
app.use('/users', require('./routes/user'))

const PORT = 3010

app.listen(PORT, console.log(`server start on port ${PORT}`))