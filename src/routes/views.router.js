import { Router } from "express";
import __dirname from "../utils.js";
import ProductManager from "../DAOs/mongoDB/productManager.class.js";

//Instaciamos ProductManager:
let productManager = new ProductManager();

//Instanciamos Router:
const router = Router();

//Obetenemos los productos y lo renderizamos para visualizar:
router.get('/', async (req, res) => {
    try {
        let products = await productManager.products();
        console.log(products)
        res.render('products', {
            title: "Inicio",
            products: products
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Ocurrió un error al obtener los productos.');
    }
});

//Productos en tiempo real:
router.get('/realtimeproducts', async (req, res) => {
    let products = await productManager.products();
    res.render('realTimeProducts',
        {
            title: "Inicio",
            products: products
        }
    );
});


export default router;