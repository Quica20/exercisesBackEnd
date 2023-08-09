import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



export default __dirname;
// El __dirname es el directorio donde se encuentra este archivo