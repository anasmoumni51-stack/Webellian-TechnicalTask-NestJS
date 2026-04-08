import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
        status = exception.getStatus();
        message = exception.message;
      }

    const errorResponse = {
      statusCode: status,
      message: message,
      error: HttpStatus[status],
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };

    console.error('Exception caught:', errorResponse);

    response.status(status).json(errorResponse);
  }
}
