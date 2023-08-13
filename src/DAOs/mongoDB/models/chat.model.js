import mongoose from "mongoose";

mongoose.connect('mongodb+srv://tomquica:Hz2Cg6jMlPEonhUv@cluster0.w2t75fc.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB Atlas");
}).catch(error => {
    console.error("Error connecting to MongoDB Atlas:", error);
});

const collection = 'chat';

const ChatSchema = new mongoose.Schema({
    user: {
        type: String,
        require: true
    },
    mensaje: {
        type: Array
    }
})

export const chatModel = mongoose.model(collection, ChatSchema)