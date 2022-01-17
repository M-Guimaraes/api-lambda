import { OrderSchema, Order } from './entities/order.entity';
import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './ordes.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Order.name, schema: OrderSchema }],
      'orders',
    ),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
