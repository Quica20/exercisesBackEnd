import mongoose from "mongoose";
import { productsModel } from "./models/products.model.js";

export default class ProductManager {
    //Hacemos la conexion con nuestra base de datos (mongoose atlas)
    connection = mongoose.connect('mongodb+srv://tomquica:Hz2Cg6jMlPEonhUv@cluster0.w2t75fc.mongodb.net/?retryWrites=true&w=majority')

    async addProduct(product) {
        let result = await productsModel.create(product)
        return result
    }

    async getProducts(limit = null) {
        let result = await productsModel.find()
        result
    }

    async getProductById(id) {
        let result = await productsModel.findOne({ _id: id })
        result
    }

    async updateProduct(id, updatedProduct) {
        let result = await productsModel.updateOne(
            { _id: id },
            { $set: updatedProduct }
        );
        return result
    }

    async deleteProduct(id) {
        let result = await productsModel.deleteOne({ _id: id })
        return result
    }
}
