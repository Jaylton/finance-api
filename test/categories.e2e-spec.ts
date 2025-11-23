import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as express from 'express';
import { ResponseInterceptor } from 'src/commons/interceptors/response.interceptor';
import { GlobalExceptionFilter } from 'src/commons/filters/http-exception.filter';
import helmet from 'helmet';
import { createUserAndLogin } from './helpers/auth.helper';

describe('Categories E2E', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let categoryId: number;
    let token: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        prisma = app.get(PrismaService);
        await prisma.$connect();
        await prisma.category.deleteMany();

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

        // Cria usuário e obtém token
        const auth = await createUserAndLogin(app, prisma);
        token = auth.token;
    });

    afterAll(async () => {
        await prisma.$disconnect();
        await app.close();
    });

    it('/categories (POST) - criar categoria', async () => {
        const res = await request(app.getHttpServer())
            .post('/categories')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Categoria Teste' })
            .expect(201);
        expect(res.body.data).toHaveProperty('id');
        categoryId = res.body.data.id;
    });

    it('/categories (GET) - listar categorias', async () => {
        const res = await request(app.getHttpServer())
            .get('/categories')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('/categories/:id (GET) - buscar categoria por id', async () => {
        const res = await request(app.getHttpServer())
            .get(`/categories/${categoryId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        expect(res.body.data).toHaveProperty('id', categoryId);
    });

    it('/categories/:id (PATCH) - atualizar categoria', async () => {
        const res = await request(app.getHttpServer())
            .patch(`/categories/${categoryId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Categoria Atualizada' })
            .expect(200);
        expect(res.body.data).toHaveProperty('name', 'Categoria Atualizada');
    });

    it('/categories/:id (DELETE) - remover categoria', async () => {
        await request(app.getHttpServer())
            .delete(`/categories/${categoryId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        // Verifica se foi removida
        await request(app.getHttpServer())
            .get(`/categories/${categoryId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404);
    });
});
