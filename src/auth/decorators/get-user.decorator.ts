import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";

export const GetUser = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {

        const req = ctx.switchToHttp().getRequest();
        const user = req.user;

        if(!user){
            throw new InternalServerErrorException('User not found in request');
        }

        //Si no hay parametros devolvemos el user completo y sino la propiedad pedida como parametro
        return (!data) ? user : user[data];

    }
);