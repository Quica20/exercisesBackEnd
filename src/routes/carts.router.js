import { Router } from "express";
import CartManager from "../DAOs/mongoDB/CartManager.class.js";
import __dirname from "../utils.js";


let cartManager = new CartManager()

const router = Router();

router.get('/:cid', async (req, res) => {
    let id = req.params.cid
    let cart = await cartManager.getCartById(id)
    if (!cart) {
        res.send("No se encontró el carrito")
        return
    }
    res.send(cart)
})

router.get('/', async (req, res) => {
    let carts = await cartManager.getAllCart()
    if (!carts) {
        res.send("No se encontró el carrito")
        return
    }
    res.send(carts)
})



router.post('/', async (req, res) => {
    await cartManager.createCart()
    res.send({ status: "success" })
})

router.post('/:cid/product/:pid', async (req, res) => {
    let cartId = req.params.cid
    let productId = req.params.pid
    await cartManager.addProductToCart(cartId, productId)
    res.send({ status: "success" })
})

//Eliminar productos de carrito por id:
router.delete('/:cid/product/:pid', async (req, res) => {
    let cartId = req.params.cid
    let productId = req.params.pid
    await cartManager.deleteProductFromCart(cartId, productId)
    res.send({ status: "success" })
})

//Eliminar todos los productos del carrito:
router.delete('/:cid', async (req, res) => {
    let cartId = req.params.cid
    await cartManager.deleteAllProductsFromCart(cartId)
    res.send({ status: "success" })
})

export default router