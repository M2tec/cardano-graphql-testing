import fs from 'fs'

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
        blockfrost      :process.env.BLOCKFROST_API_KEY || 'make a .env',            
        addressListSize :process.env.ADDRESS_LIST_SIZE || 'make a .env'
    }  

        const inputFile = path.join(__dirname, "data", `address_data_${keys.addressListSize}.csv`);

    let data = { }
    
    addressList = fs
    .readFileSync(inputFile, "utf8")
    .split("\n")
    .map((a) => a.trim())
    .filter(Boolean); // remove empty lines

    data["addressList"] = addressList

    return {
        projectRoot,
        keys,
        data
    }
}

export default getConfig()