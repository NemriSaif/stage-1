const express=require('express')
const app=express()
const mongoose=require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.DATABASE_URL)

const db=mongoose.connection
db.on('error',(error)=>console.log(error))
db.once('open',()=>console.log('connected to database'))

app.use(express.json())

require('./models/Clients')
require('./models/Environment')
require('./models/Key')


const ClientRouter=require('./routes/Clients')
const EnvRouter=require('./routes/Environments')
const KeyRouter=require('./routes/Keys')


app.use('/Clients', ClientRouter)
app.use('/Environments',EnvRouter)
app.use('/Keys',KeyRouter)

app.listen(3001,()=>console.log('server started'))