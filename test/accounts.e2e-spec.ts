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
import { randomUUID } from 'crypto';

describe('Accounts E2E', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let accountId: number;
    let token: string;
    let email: string = randomUUID() + '@test.com';

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        prisma = app.get(PrismaService);
        await prisma.$connect();
        await prisma.account.deleteMany();

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

        await prisma.user.create({
            data: { name: 'Test User', email: email, password: await bcrypt.hash('testpass', 10) },
        });

        // Faça login para obter o token
        const res = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: email, password: 'testpass' });
        token = res.body.data;
    });

    afterAll(async () => {
        await prisma.$disconnect();
        await app.close();
    });

    it('/accounts (POST) - criar conta', async () => {
        const res = await request(app.getHttpServer())
            .post('/accounts')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Conta Teste', init_amount: 100, current_amount: 100 })
            .expect(201);

        expect(res.body.data).toHaveProperty('id');
        accountId = res.body.data.id;
    });

    it('/accounts (GET) - listar contas', async () => {
        const res = await request(app.getHttpServer())
            .get('/accounts')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('/accounts/:id (GET) - buscar conta por id', async () => {
        const res = await request(app.getHttpServer())
            .get(`/accounts/${accountId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        expect(res.body.data).toHaveProperty('id', accountId);
    });

    it('/accounts/:id (PATCH) - atualizar conta', async () => {
        const res = await request(app.getHttpServer())
            .patch(`/accounts/${accountId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Conta Atualizada', current_amount: 200 })
            .expect(200);
        expect(res.body.data).toHaveProperty('name', 'Conta Atualizada');
        expect(res.body.data).toHaveProperty('current_amount', 200);
    });

    it('/accounts/:id (DELETE) - remover conta', async () => {
        await request(app.getHttpServer())
            .delete(`/accounts/${accountId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        // Verifica se foi removido
        await request(app.getHttpServer())
            .get(`/accounts/${accountId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404);
    });
});
