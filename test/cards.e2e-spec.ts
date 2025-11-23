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

describe('Cards E2E', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let cardId: number;
    let token: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        prisma = app.get(PrismaService);
        await prisma.$connect();
        await prisma.card.deleteMany();

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

        ({ token } = await createUserAndLogin(app, prisma));
    });

    afterAll(async () => {
        await prisma.$disconnect();
        await app.close();
    });

    it('/cards (POST) - criar cartão', async () => {
        const res = await request(app.getHttpServer())
            .post('/cards')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Cartão Teste' })
            .expect(201);
        expect(res.body.data).toHaveProperty('id');
        cardId = res.body.data.id;
    });

    it('/cards (GET) - listar cartões', async () => {
        const res = await request(app.getHttpServer())
            .get('/cards')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('/cards/:id (GET) - buscar cartão por id', async () => {
        const res = await request(app.getHttpServer())
            .get(`/cards/${cardId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        expect(res.body.data).toHaveProperty('id', cardId);
    });

    it('/cards/:id (PATCH) - atualizar cartão', async () => {
        const res = await request(app.getHttpServer())
            .patch(`/cards/${cardId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Cartão Atualizado' })
            .expect(200);
        expect(res.body.data).toHaveProperty('name', 'Cartão Atualizado');
    });

    it('/cards/:id (DELETE) - remover cartão', async () => {
        await request(app.getHttpServer())
            .delete(`/cards/${cardId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        // Verifica se foi removido
        await request(app.getHttpServer())
            .get(`/cards/${cardId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404);
    });
});
