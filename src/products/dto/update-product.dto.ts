// import { PartialType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

// Importamos de swagger el PartialType para que se documente correctamente, pero por lo demás es igual

export class UpdateProductDto extends PartialType(CreateProductDto) {}
