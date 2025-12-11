import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './infrastructure/http/modules/user.module';
import { CardModule } from './infrastructure/http/modules/card.module';
import { CategoryModule } from './infrastructure/http/modules/category.module';
import { AuthModule } from './modules/auth/auth.module';
import { AccountModule } from './infrastructure/http/modules/account.module';
import { TransferModule } from './infrastructure/http/modules/transfer.module';

@Module({
  imports: [UserModule, PrismaModule, CardModule, CategoryModule, AccountModule, AuthModule, TransferModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
