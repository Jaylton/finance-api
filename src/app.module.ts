import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';
import { TransfersService } from './modules/transfers/transfers.service';
import { UserModule } from './infrastructure/http/modules/user.module';
import { CardModule } from './infrastructure/http/modules/card.module';

@Module({
  imports: [UserModule, PrismaModule, CardModule],
  controllers: [AppController],
  providers: [AppService, TransfersService],
})
export class AppModule {}
