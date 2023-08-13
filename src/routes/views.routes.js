import { Router } from 'express';
import __dirname from "../utils.js"
import ProductManager from '../DAOs/mongoDB/ProductManager.class.js';


let productManager = new ProductManager()

const router = Router();

router.get('/', async (req, res) => {
    let products = await productManager.getProducts();
    res.render('home', {
        title: "Inicio",
        products: products
    });
})

router.get('/realtimeproducts', async (req, res) => {
    let products = await productManager.getProducts();
    res.render('realTimeProducts',
        {
            title: "Inicio",
            products: products
        }
    );
});

router.get('/chat', async (req, res) => {
    res.render('chat');
})

export default router;