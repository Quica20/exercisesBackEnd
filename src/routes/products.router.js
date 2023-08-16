import { Router } from "express";
import ProductManager from "../DAOs/mongoDB/productManager.class.js";
import __dirname from "../utils.js"

let productManager = new ProductManager();
const router = Router();

//Get: todos los productos.
/*router.get('/', async (req, res) => {
    let products = await productManager.getAllProducts()
    res.send(products)
});*/

//Get: con filtros y paginacion de los productos.
router.get('/', async (req, res) => {
    /*let limit = Number(req.query.limit);
    let page = Number(req.query.page);
    let sort = Number(req.query.sort);
    let filter = req.query.filter;
    let valueFilter = req.query.valueFilter;*/
    //limit, page, sort, filter, valueFilter 

    let page = parseInt(req.query.page);
    let products = await productManager.getProducts(page);
    console.log(products)
    res.render('productsPagination', products);
    /*res.render('productsPagination', {
        title: 'Lista de Productos',
        products: products
    })*/
    /*
    res.send(products)
        
    */
});

//Get: por id del producto.
router.get('/:pid', async (req, res) => {
    let id = req.params.pid
    let product = await productManager.getProductById(id)
    if (!product) {
        res.send("No se encontró el producto")
        return
    }
    res.send(product)
});

//Post: producto nuevo.
router.post('/', async (req, res) => {
    let newProduct = req.body
    await productManager.addProduct(newProduct)
    const products = await productManager.getProducts()
    req.socketServer.sockets.emit('update-products', products)
    res.send({ status: "success" })
})

//Put: mediante el id del producto.
router.put('/:pid', async (req, res) => {
    let id = req.params.pid
    let newProduct = req.body
    await productManager.updateProduct(id, newProduct)
    res.send({ status: "success" })
})

//Delete: mediante el id del producto.
router.delete('/:pid', async (req, res) => {
    let id = req.params.pid
    await productManager.deleteProduct(id)
    res.send({ status: "success" })
})

export default router
