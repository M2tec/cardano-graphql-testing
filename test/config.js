import dotenv from 'dotenv';
import path, { dirname, resolve } from 'path'
// import { parseURI } from './utils/helpers';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const configFile=path.resolve(__dirname, '../.env');

dotenv.config({ path: configFile });

export const getConfig=async()=>{  
    const projectRoot = resolve(dirname(__dirname), "./");
    
    const keys={
        blockfrost      :process.env.BLOCKFROST_API_KEY || 'make a .env'                   
    }  

    return {
        projectRoot,
        keys
    }
}

export default getConfig()