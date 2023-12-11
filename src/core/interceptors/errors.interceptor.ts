import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        console.log('ERROR', err);
        let message = err.status ? err.message : 'Erro interno do servidor';
        let status = err.status || HttpStatus.INTERNAL_SERVER_ERROR;
        if (err instanceof BadRequestException) {
          const classValidatorError = err.getResponse();
          message = classValidatorError['message'].join(', ');
          status = classValidatorError['statusCode'];
        }
        return throwError(() => new HttpException(message, status));
      }),
    );
  }
}
