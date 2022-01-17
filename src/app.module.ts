import { Module } from '@nestjs/common';
import configuration from './config/configurations';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersModule } from './modules/orders/orders.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    OrdersModule,
    MongooseModule.forRoot(configuration().database.host, {
      connectionName: 'orders',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
