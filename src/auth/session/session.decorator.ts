import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as S from 'supertokens-node/recipe/session';

export const Session = createParamDecorator(async (data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const response = ctx.switchToHttp().getResponse();

  const session = await S.getSession(request, response, { sessionRequired: false });
  return session;
});
