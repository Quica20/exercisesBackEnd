import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import { Server } from 'socket.io';
import ProductManager from './DAOs/mongoDB/productManager.class.js';

//Importamos las rutas:
import routerViews from './routes/views.router.js';
import routerProducts from './routes/products.router.js';
import routerCarts from './routes/carts.router.js';

//Configuracion Inicial:
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Static
app.use(express.static(__dirname + '/public'));

// Estructura de handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

//Server Start and Sockt.io:
const expressServer = app.listen(8080, () => console.log('Servidor Levantado'));
const socketServer = new Server(expressServer);

///Configuracion de tiempor real:
socketServer.on("connection", async (socket) => {
    console.log("Estas conectado " + socket.id)

    //Instanciamos:
    let productManager = new ProductManager()

    // Se envian todos los productos al conectarse
    socket.emit("update-products", await productManager.products())

    // Se agrega el producto y se vuelven a renderizar para todos los sockets conectados
    socket.on("add-product", async (productData) => {
        await productManager.addProduct(productData)
        socketServer.emit("update-products", await productManager.products())
    })

    // Se elimina el producto y se vuelven a renderizar para todos los sockets conectados
    socket.on("delete-product", async (productID) => {
        await productManager.deleteProduct(productID)
        socketServer.emit("update-products", await productManager.products())
    })
})

//Configurando en tiempo real socketServer:
app.use((req, res, next) => {
    req.socketServer = socketServer
    next()//importantisimo
});

// Routers
app.use("/", routerViews);
app.use("/products", routerProducts);
app.use("/carts", routerCarts);