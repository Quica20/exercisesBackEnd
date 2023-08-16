import mongoose from "mongoose";
import ProductManager from "./productManager.class.js";
import { cartModel } from "./models/carts.model.js";


export default class CartManager {
    //Hacemos la conexion con nuestra base de datos (mongoose atlas)
    connection = mongoose.connect('mongodb+srv://tomquica:Hz2Cg6jMlPEonhUv@cluster0.w2t75fc.mongodb.net/?retryWrites=true&w=majority')

    // instanciamos el ProductManager
    productManager = new ProductManager()

    //Creamos un Carrito:
    async createCart() {
        try {
            const result = await cartModel.create({ products: {} })
            return result
        } catch (error) {
            console.log('Error al crear un carrito', error)
        }
    }

    //Obtenemos todos los Carritos:
    async getAllCart() {
        try {
            const result = await cartModel.find({}).lean()////
            return result
        } catch (error) {
            console.log('Error al obtener todos los carritos', error)
        }
    };

    //Obtenemos un carrito por id:
    async getCartById(id) {
        try {
            const result = await cartModel.findOne({ _id: id }).populate('products.product');
            return result
        } catch (error) {
            console.log('Error al obtener un carrito por id', error)
        }
    };

    /*//Eliminar Carrito por id:
    async deleteCartFromId(id) {
        try {
            let result = await cartModel.deleteOne({ _id: id })
            return result
        } catch (error) {
            console.log('Error al borrar el producto', error)
        }
    };*/

    //Agregamos productos al carrito:
    async addProductToCart(cid, pid) {
        try {
            const product = await this.productManager.getProductById(pid);
            const cart = await this.getCartById(cid);
            cart.products.push({ product: product });
            await cart.save()
            return;
        } catch (error) {
            console.log('Error al agregar un producto al carrito', error)
        }
    };

    //Eliminar un producto del Carrito:
    async deleteProductFromCart(cid, pid) {
        try {
            const cart = await this.getCartById(cid);
            cart.products.pull(pid)
            await cart.save()
            return;
        } catch (error) {
            console.log('Error al eliminar un producto del Carrito', error)
        }
    };

    //Eliminar todos los productos de un Carrito:
    async deleteAllProductsFromCart(cid) {
        try {
            const cart = await this.getCartById(cid);
            cart.products = []
            await cart.save()
        } catch (error) {
            console.log('Error al eliminar todos los productos del carrito', error)
        }
    };

    //Put api/carts/:cid

};