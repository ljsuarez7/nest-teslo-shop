import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';


@Injectable()
export class FilesService {
 
    //Esto se podria hacer generico recibiendo el tipo de archivo y asi buscar en la carpeta correspondiente
    getStaticProductImage(imageName: string){

        const path = join(__dirname, '../../static/products', imageName);

        if(!existsSync(path)) {
            throw new BadRequestException(`No product found with image ${imageName}`);
        }

        return path;

    }


}
