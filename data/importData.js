import mongoose from 'mongoose';
import { productsModel } from '../src/DAOs/mongoDB/models/products.model.js';
import { productArray } from './products.js';

// URL de conexión a tu base de datos en MongoDB Atlas
const uri = 'mongodb+srv://tomquica:Hz2Cg6jMlPEonhUv@cluster0.w2t75fc.mongodb.net/?retryWrites=true&w=majority';

async function importData() {
    await mongoose.connect(uri);
    try {
        const result = await productsModel.insertMany(productArray);
        console.log(`${result.length} documentos insertados`);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.disconnect();
    }
}

importData();
