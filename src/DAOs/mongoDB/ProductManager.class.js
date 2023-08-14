import mongoose from "mongoose";
import { productsModel } from "./models/products.model.js";

export default class ProductManager {
    //Hacemos la conexion con nuestra base de datos (mongoose atlas)
    connection = mongoose.connect('mongodb+srv://tomquica:Hz2Cg6jMlPEonhUv@cluster0.w2t75fc.mongodb.net/?retryWrites=true&w=majority')

    async addProduct(product) {
        let result = await productsModel.create(product)
        return result
    }

    async getProducts(limit = 10, page = 1, sort = 0, filter = null, valueFilter = null) {
        let whereOptions = {}
        if (filter != '' && valueFilter != '') {
            whereOptions = { [filter]: valueFilter }//De esta forma podemos colocar una key dinamica. []
        };
        let result = await productsModel.paginate(
            whereOptions,
            {
                limit: limit,
                page: page,
                sort: { price: sort }
            }
        );
        return result
    }

    async getProductById(id) {
        let result = await productsModel.findOne({ _id: id })
        return result
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
