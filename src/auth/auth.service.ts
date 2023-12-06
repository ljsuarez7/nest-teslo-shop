import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto/index';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ){}

  async create(createUserDto: CreateUserDto) {

    try {

      const {password, ...userData} = createUserDto;
      
      const user = this.userRepository.create({
        ...userData, 
        password: bcrypt.hashSync(password, 10)
      });

      await this.userRepository.save(user);
      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({id: user.id})
      };

    } catch (error) {
      this.handleDBErrors(error);
    }

  }

  private getJwtToken(payload: JwtPayload){

    const token = this.jwtService.sign(payload);

    return token;

  }

  async login(loginUserDto: LoginUserDto){

    //Estaria bien comprobar que el usuario está activo para no dejarle logearse si no lo está

    const {password, email} = loginUserDto;

    const user = await this.userRepository.findOne({
      where: {email},
      select: {email: true, password: true, id: true}
    });

    //Esto es con fines educativos, pero al usuario no se le deberia mostrar si el error fue de pass o email, solo q no es correcto
    //Ya en el log se podria mostrar el error correcto
    if(!user){
      throw new UnauthorizedException('Credentials are not valid(email)');
    }
    
    if(!bcrypt.compareSync(password, user.password)){
      throw new UnauthorizedException('Credentials are not valid(password)');
    }    

    return {
      ...user,
      token: this.getJwtToken({id: user.id})
    };

  }

  //METODO QUE SIRVE PARA REVALIDAR EL TOKEN DEL USUARIO Y DE ESTA MANERA EXTENDER LA VALIDEZ DEL MISMO MIENTRAS EL USUARIO ESTÁ ACTIVO EN LA APP
  async checkStatus(user: User){

    return {
      ...user,
      token: this.getJwtToken({id: user.id})
    };

  }

  private handleDBErrors(error: any): never{

    if(error.code === '23505'){
      throw new BadRequestException(error.detail);
    }
    console.log(error);

    throw new InternalServerErrorException('Please check server logs');
    
  }

}
