import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const collection = 'products';


const ProductsSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String
    },
    code: {
        type: Number,
        require: true
    },
    price: {
        type: Number,
        requiere: true
    },
    stock: {
        type: Number,
        require: true
    }
});

ProductsSchema.plugin(mongoosePaginate)
export const productsModel = mongoose.model(collection, ProductsSchema)