import express from 'express'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'

import routerProducts from './routes/products.router.js';
import routerCarts from './routes/carts.router.js';
import routerViews from './routes/views.routes.js';

import { Server } from "socket.io";
import { chatModel } from './DAOs/mongoDB/models/chat.model.js';
import ProductManager from './DAOs/mongoDB/ProductManager.class.js'

// initial configuration
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static
app.use(express.static(__dirname + "/public"));

// Estructura de handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");


// server start and socket io
const expressServer = app.listen(8080, () => console.log("Servidor levantado"))
const socketServer = new Server(expressServer)

socketServer.on("connection", async (socket) => {
    console.log("Estas conectado " + socket.id)

    let productManager = new ProductManager()

    //Chat
    socket.on("message", async (data) => {
        console.log(data)
        try {
            const chatData = new chatModel({
                user: data.user,
                mensaje: data.mensaje
            });
            await chatData.save();
        } catch (error) {
            console.error('Error saving message', error)
        }
        const mensajes = await chatModel.find({})
        socketServer.emit("imprimir", mensajes);
    });
    socket.on("authenticatedUser", (data) => {
        socket.broadcast.emit('newUserAlert', data)
    });

    // Se envian todos los productos al conectarse
    socket.emit("update-products", await productManager.getProducts())

    // Se agrega el producto y se vuelven a renderizar para todos los sockets conectados
    socket.on("add-product", async (productData) => {
        await productManager.addProduct(productData)
        socketServer.emit("update-products", await productManager.getProducts())
    })

    // Se elimina el producto y se vuelven a renderizar para todos los sockets conectados
    socket.on("delete-product", async (productID) => {
        await productManager.deleteProduct(productID)
        socketServer.emit("update-products", await productManager.getProducts())
    })
})

//configurando en tiempo real socketServer:
app.use((req, res, next) => {
    req.socketServer = socketServer
    next()//importantisimo
});

// routers
app.use("/", routerViews);
app.use("/products", routerProducts);
app.use("/carts", routerCarts);