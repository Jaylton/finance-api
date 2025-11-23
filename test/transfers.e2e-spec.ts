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

describe('Transfers E2E', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let token: string;
    let transferId: number;
    let categoryId: number;
    let accountId: number;
    let startDate: string;
    let endDate: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        prisma = app.get(PrismaService);
        await prisma.$connect();
        await prisma.transfer.deleteMany();
        await prisma.category.deleteMany();
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

        // Cria usuário e obtém token
        const auth = await createUserAndLogin(app, prisma);
        token = auth.token;

        // Cria categoria e conta para usar na transferência
        const cat = await prisma.category.create({ data: { name: 'Categoria Transfer' } });
        categoryId = cat.id;
        const acc = await prisma.account.create({ data: { name: 'Conta Transfer', init_amount: 100, current_amount: 100 } });
        accountId = acc.id;
        
        startDate = new Date((new Date()).setDate(1)).toISOString();
        endDate = new Date((new Date()).setDate(30)).toISOString();
    });

    afterAll(async () => {
        await prisma.$disconnect();
        await app.close();
    });

    it('/transfers (POST) - criar transferência', async () => {
        const res = await request(app.getHttpServer())
            .post('/transfers')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Transfer Test',
                date: '2025-11-23',
                type: 'EXPENSE',
                amount: 50,
                accountId,
                categories: [categoryId],
            })
            .expect(201);
        expect(res.body.data).toHaveProperty('id');
        expect(res.body.data).toMatchObject({
            name: 'Transfer Test',
            type: 'EXPENSE',
            amount: 50,
            accountId,
        });
        expect(Array.isArray(res.body.data.categories)).toBe(true);
        expect(res.body.data.categories[0]).toHaveProperty('id', categoryId);
        transferId = res.body.data.id;
    });


    it('/transfers (GET) - listar transferências com filtros obrigatórios', async () => {
        const res = await request(app.getHttpServer())
            .get('/transfers')
            .query({ startDate, endDate })
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(0);
        const transfer = res.body.data.find((t: any) => t.id === transferId);
        expect(transfer).toBeDefined();
        expect(transfer).toMatchObject({
            id: transferId,
            name: 'Transfer Test',
            type: 'EXPENSE',
            amount: 50,
            accountId,
        });
        expect(Array.isArray(transfer.categories)).toBe(true);
        expect(transfer.categories[0]).toHaveProperty('id', categoryId);
    });

    it('/transfers (GET) - filtro por tipo', async () => {
        const res = await request(app.getHttpServer())
            .get('/transfers')
            .query({ startDate, endDate, type: 'EXPENSE' })
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.some((t: any) => t.type === 'EXPENSE')).toBe(true);
    });

    it('/transfers (GET) - filtro por accountId', async () => {
        const res = await request(app.getHttpServer())
            .get('/transfers')
            .query({ startDate, endDate, accountId })
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.every((t: any) => t.accountId === accountId)).toBe(true);
    });

    it('/transfers (GET) - filtro por categoryId', async () => {
        const res = await request(app.getHttpServer())
            .get('/transfers')
            .query({ startDate, endDate, categoryId: categoryId })
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.every((t: any) => t.categories.some((c: any) => c.id === categoryId))).toBe(true);
    });

    it('/transfers/graphic (GET) - gráfico financeiro', async () => {
        const res = await request(app.getHttpServer())
            .get('/transfers/graphic')
            .query({ startDate, endDate })
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data[0]).toHaveProperty('mes');
        expect(res.body.data[0]).toHaveProperty('ano');
        expect(res.body.data[0]).toHaveProperty('total_entradas');
        expect(res.body.data[0]).toHaveProperty('total_saidas');
        expect(res.body.data[0]).toHaveProperty('investimentos');
    });

    it('/transfers/:id (PATCH) - atualizar transferência', async () => {
        const res = await request(app.getHttpServer())
            .patch(`/transfers/${transferId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Transfer Updated', amount: 75 })
            .expect(200);
        expect(res.body.data).toHaveProperty('name', 'Transfer Updated');
        expect(res.body.data).toHaveProperty('amount', 75);
        expect(res.body.data).toHaveProperty('id', transferId);
    });

    it('/transfers (GET) - conferir estrutura após update', async () => {
        const res = await request(app.getHttpServer())
            .get('/transfers')
            .query({ startDate, endDate })
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
            
        const transfer = res.body.data.find((t: any) => t.id === transferId);
        expect(transfer).toBeDefined();
        expect(transfer).toHaveProperty('name', 'Transfer Updated');
        expect(transfer).toHaveProperty('amount', 75);
        expect(transfer).toHaveProperty('type', 'EXPENSE');
        expect(transfer).toHaveProperty('accountId', accountId);
        expect(Array.isArray(transfer.categories)).toBe(true);
        expect(transfer.categories[0]).toHaveProperty('id', categoryId);
    });

    it('/transfers/:id (DELETE) - remover transferência', async () => {
        await request(app.getHttpServer())
            .delete(`/transfers/${transferId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        // Verifica se foi removida
        const res = await request(app.getHttpServer())
            .get('/transfers')
            .query({ startDate, endDate })
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        const transfer = res.body.data.find((t: any) => t.id === transferId);
        expect(transfer).toBeUndefined();
    });
});
