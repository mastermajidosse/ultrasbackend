import mongoose from "mongoose"


const connectDb = async () => {
    try {
        console.log('MongoDB URI:', process.env.CONNECTION_URL);
        const conn = await mongoose.connect(process.env.CONNECTION_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        })

        console.log(`MongoDB connected:${conn.connection.host}`)
    } catch (err) {
        console.log(`Error:${err.message}`)
        process.exit(1)
    }
}


export default connectDb