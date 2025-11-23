import { PrismaService } from '../../src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { randomUUID } from 'crypto';

export async function createUserAndLogin(app: INestApplication, prisma: PrismaService) {
  const email = randomUUID() + '@test.com';
  const password = 'testpass';
  await prisma.user.create({
    data: { name: 'Test User', email, password: await bcrypt.hash(password, 10) },
  });
  const res = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email, password });
  // Ajuste conforme o formato do seu retorno de login
  const token = res.body.data?.access_token || res.body.data;
  return { token, email, password };
}
