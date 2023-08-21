import { Router } from "express";
import __dirname from "../utils.js";
import ProductManager from "../DAOs/mongoDB/productManager.class.js";

//Instaciamos ProductManager:
let productManager = new ProductManager();

//Instanciamos Router:
const router = Router();

//vista para registrarse
router.get('/register', (req, res) => {
    res.render('register');
})
//Vista para ingresar
router.get('/login', (req, res) => {
    res.render('login');
})

//Obetenemos los productos y usuario, lo renderizamos para visualizar:
router.get('/', async (req, res) => {
    try {
        let products = await productManager.products();

        let profileRoleTemplate;
        console.log(String(req.session.user.role), 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
        if (req.session.user.role === "Admin") {
            profileRoleTemplate = 'profileRoleProducts';
        } else {
            profileRoleTemplate = 'profileProducts';
        }

        const context = {
            title: 'Inicio',
            user: req.session.user,
            products: products
        };

        res.render(profileRoleTemplate, context);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Ocurrió un error al obtener los productos.');
    }
});


//Productos de un carrito:
router.get('/ProducstInCart/:cid', async (req, res) => {
    let cartId = req.params.cid
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