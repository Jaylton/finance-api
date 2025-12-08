import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { PrismaModule } from './prisma/prisma.module';
import { CardsModule } from './modules/cards/cards.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { AuthModule } from './modules/auth/auth.module';
import { TransfersService } from './modules/transfers/transfers.service';
import { TransfersModule } from './modules/transfers/transfers.module';
import { UserModule } from './infrastructure/http/modules/user.module';

@Module({
  imports: [UserModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService, TransfersService],
})
export class AppModule {}
