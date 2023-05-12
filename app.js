import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDb from './config/connectdb.js'
const app = express()
dotenv.config()

const DATABASE_URL = "mongodb+srv://admin:admin1234@cluster0.sf81w4b.mongodb.net/Node-API?retryWrites=true&w=majority"

const port = process.env.PORT || 5001


// cors policiy 

app.use(cors())

//mongodb connection
connectDb(DATABASE_URL)

//json middleware 

app.use(express.json())

app.listen(port, () => {
    console.log(`server working on port ${port}`)
})
