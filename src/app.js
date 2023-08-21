import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import { Server } from 'socket.io';
import ProductManager from './DAOs/mongoDB/productManager.class.js';
//Import for Session:
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';


//Importamos las rutas:
import sessionRouter from './routes/session.router.js';
import routerViews from './routes/views.router.js';
import routerProducts from './routes/products.router.js';
import routerCarts from './routes/carts.router.js';

//Connnecta database
const connection = mongoose.connect(
    'mongodb+srv://tomquica:Hz2Cg6jMlPEonhUv@cluster0.w2t75fc.mongodb.net/?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
);

//Configuracion Inicial:
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Static
app.use(express.static(__dirname + '/public'));

//Config Session:
app.use(session({
    store: new MongoStore({
        mongoUrl: 'mongodb+srv://tomquica:Hz2Cg6jMlPEonhUv@cluster0.w2t75fc.mongodb.net/?retryWrites=true&w=majority',
        ttl: 15
    }),
    secret: 'mongoSecret',
    resave: true,
    saveUninitialized: false
}));

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
app.use('/api/sessions', sessionRouter);
app.use("/products", routerProducts);
app.use("/carts", routerCarts);