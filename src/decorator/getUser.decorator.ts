import { UserPayload } from '@/auth/dto/auth.dto';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (key: keyof UserPayload, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return key ? request.user && request.user[key] : request.user;
  },
);
