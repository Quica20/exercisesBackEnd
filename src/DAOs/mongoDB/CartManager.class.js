import mongoose from "mongoose";
import { cartModel } from "./models/carts.model.js";
import ProductManager from "./ProductManager.class.js";


export default class CartManager {
    //Hacemos la conexion con nuestra base de datos (mongoose atlas)
    connection = mongoose.connect('mongodb+srv://tomquica:Hz2Cg6jMlPEonhUv@cluster0.w2t75fc.mongodb.net/?retryWrites=true&w=majority')

    // instanciamos el productManager
    productManager = new ProductManager()

    async createCart() {
        const result = await cartModel.create({ products: {} })
        return result
    }

    async getAllCart() {
        const result = await cartModel.find({})
        return result
    }

    async getCartById(id) {
        const result = await cartModel.findOne({ _id: id }).populate('products.product');
        return result
    }

    async addProductToCart(cid, pid) {
        const product = await this.productManager.getProductById(pid);
        const cart = await this.getCartById(cid);
        cart.products.push({ product: product });
        await cart.save()
        return;
    }

}