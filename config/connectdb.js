import mongoose, { mongo } from 'mongoose'
const connectDb = async (DATABASE_URL) => {
    try {
        const DB_OPTIONS = {
            dbName:"Naveen"
        }
        await mongoose.connect(DATABASE_URL, DB_OPTIONS)
        console.log("connncect to db")
    } catch (error) {
        console.log(error)
        
    }
}


export default connectDb