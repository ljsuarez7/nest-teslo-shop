import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";

export const RawHeaders = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        return ctx.switchToHttp().getRequest().rawHeaders;
    }
);

//ESTE DECORADOR SERIA IDEAL TENERLO EN UN SITIO COMUN MÁS BIEN