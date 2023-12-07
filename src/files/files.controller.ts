import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from './helpers';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//mirar como se haria esto con ParseFilePipe que es nuevo en NEST
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService, private readonly configService: ConfigService) {}

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response, //Esto hace que tu mismo tengas que emitir la respuesta y no que lo haga nest automaticamente
    //Tambien se salta interceptores y algunos pasos del ciclo de vida de nest, por lo q hay que estar muy seguroi de usarlo
    @Param('imageName') imageName: string
  ){

    const path = this.filesService.getStaticProductImage(imageName);

    res.sendFile(path);
  }


  @Post('product')
  @UseInterceptors(
    FileInterceptor(
      'file', 
      {
        fileFilter: fileFilter,
        storage: diskStorage({
          destination: './static/products',
          filename: fileNamer
        })
      }
    )
  )
  uploadProductImage(@UploadedFile() file: Express.Multer.File){
    //Mejor no subir esta imagen al filesystem, mejor a un servidor distinto, aqui se hará así por simplificar
    //por ejemplo amazon o cloudinary

    //Si la imagen no pasa las validaciones del fileFilter en el interceptor entonces llegará undefined y aqui es donde sacaremos la excepcion
    if( !file ){
      throw new BadRequestException('Make sure that the file is an image');
    }

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;
    
    return {secureUrl};
  }

}
