import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [UsersModule, CategoriesModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
