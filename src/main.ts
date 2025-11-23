import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './commons/interceptors/response.interceptor';
import { GlobalExceptionFilter } from './commons/filters/http-exception.filter';
import helmet from 'helmet';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new GlobalExceptionFilter());

    app.use(helmet());

    app.enableCors({
        origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // seu React
        methods: 'GET,POST,PUT,PATCH,DELETE',
        allowedHeaders: 'Content-Type,Authorization',
        credentials: true,
    });

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
