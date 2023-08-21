import mongoose from "mongoose";
import { productsModel } from "./models/products.model.js";

export default class ProductManager {
    //Hacemos la conexion con nuestra base de datos (mongoose atlas) llamada ecommerce.
    connection = mongoose.connect('mongodb+srv://tomquica:Hz2Cg6jMlPEonhUv@cluster0.w2t75fc.mongodb.net/?retryWrites=true&w=majority');

    //Agregar un producto:
    async addProduct(product) {
        try {
            let result = await productsModel.create(product);
            console.log('Productos agregado')
            return result
        } catch (error) {
            console.error('Error al agregar producto:', error)
        }
    };

    //Obtener todos los productos:
    async products() {
        try {
            let result = await productsModel.find().lean()
            return result
        } catch (error) {
            console.log('Error al obtener todos los productos', error)
        }
    }// Preguntar porque si esto esta en funcionamiendo no funciona lo de abajo!!!!!

    //Obtenemos los productos 'Paginate' y 'Filtros' : 
    getProducts = async (page) => {
        if (!page) page = 1;
        let result = await productsModel.paginate({}, { page, limit: 5, lean: true })
        result.prevLink = result.hasPrevPage ? `http://localhost:8080/products?page=${result.prevPage}` : '';
        result.nextLink = result.hasNextPage ? `http://localhost:8080/products?page=${result.nextPage}` : '';
        result.isValid = !(page <= 0 || page > result.totalPages)
        return result
    }

    /*async getProducts(limit = 10, page = 1, sort = 0, filter = null, valueFilter = null) {
        try {
            let whereOptions = {}
            if (filter != '' && valueFilter != '') {
                whereOptions = { [filter]: valueFilter }//De esta forma podemos colocar una key dinamica. []
            };
            let result = await productsModel.paginate(
                whereOptions,
                {
                    limit: limit,
                    page: page,
                    sort: { price: sort },
                    lean: true
                }
            );
            result.prevLink = result.hasPrevPage ? `http://localhost:8080/products?page=${result.prevPage}` : '';
            result.nextLink = result.hasNextPage ? `http://localhost:8080/products?page=${result.nextPage}` : '';
            return result
        } catch (error) {
            console.log('Error al obtener los productos con paginacion y filtros', error)
        }
    };*/


    //Obtenemos un producto por su Id:
    async getProductById(id) {
        try {
            let result = await productsModel.findOne({ _id: id })
            return result
        } catch (error) {
            console.log('Error al obtener productos por id', error)
        }
    }

    //Actualizamos por Id:
    async updateProduct(id, updatedProduct) {
        try {
            let result = await productsModel.updateOne(
                { _id: id },
                { $set: updatedProduct }
            );
            return result
        } catch (error) {
            console.log('Error al actulizar un producto por Id', error)
        }
    };

    //Borramos producto por id:
    async deleteProduct(id) {
        try {
            let result = await productsModel.deleteOne({ _id: id })
            return result
        } catch (error) {
            console.log('Error al borrar el producto', error)
        }
    }
};

