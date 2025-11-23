import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = exception.message || 'Internal server error';

        // NestJs HttpException (lançadas por você)
        if (exception instanceof HttpException) {
            status = exception.getStatus();
            message = exception.message || exception.getResponse().toString();

            const responseError = exception.getResponse();

            // Quando vem do ValidationPipe, o Nest retorna
            // { statusCode: 400, message: [...], error: 'Bad Request' }
            if (typeof responseError === 'object') {
                const r = responseError as Record<string, any>;
                message = r.message || r.error || exception.message;
            } else {
                message = responseError;
            }
        }

        // Prisma errors
        else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
            status = HttpStatus.BAD_REQUEST;

            switch (exception.code) {
                case 'P2002':
                    message = 'A record with this value already exists.';
                    break;
                case 'P2025':
                    message = 'Record not found.';
                    break;
                default:
                    message = exception.message;
            }
        }

        return response.status(status).json({
            success: false,
            message,
            statusCode: status,
            timestamp: new Date().toISOString(),
        });
    }
}
