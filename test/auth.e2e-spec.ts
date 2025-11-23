import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as express from 'express';
import { ResponseInterceptor } from 'src/commons/interceptors/response.interceptor';
import { GlobalExceptionFilter } from 'src/commons/filters/http-exception.filter';
import helmet from 'helmet';

describe('Auth E2E', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        // garanta o ValidationPipe como no main
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

        prisma = app.get(PrismaService);

        await prisma.$connect();
        await prisma.user.deleteMany();

        // criar usuário com senha hasheada como no runtime
        const hashed = await bcrypt.hash('testpass', 10);
        await prisma.user.create({
            data: { name: 'Test User', email: 'test@test.com', password: hashed },
        });

        // 🔥 REPLICAR CONFIGURAÇÕES DO main.ts
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
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        app.enableCors({
            origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
            methods: 'GET,POST,PUT,PATCH,DELETE',
            allowedHeaders: 'Content-Type,Authorization',
            credentials: true,
        });

        await app.init();
    });

    afterAll(async () => {
        await prisma.$disconnect();
        await app.close();
    });

    it('/auth/login (POST) - sucesso', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'test@test.com', password: 'testpass' })
            .expect(201);

        expect(res.body).toHaveProperty('data');
    });

    it('/auth/login (POST) - falha', async () => {
        await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'test@test.com', password: 'wrong' })
            .expect(401);
    });
});
