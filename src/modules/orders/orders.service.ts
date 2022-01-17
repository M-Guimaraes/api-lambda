import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderDocuemnt } from './entities/order.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocuemnt>,
  ) {}

  create(createOrderDto: CreateOrderDto) {
    return this.orderModel.create(createOrderDto);
  }

  findAll() {
    return this.orderModel.find();
  }

  findOne(id: string) {
    return this.orderModel.findById(id);
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<void> {
    const order = await this.orderModel.findById(id);
    return order.updateOne({ ...updateOrderDto, updated_at: new Date() });
  }

  async remove(id: string) {
    const order = await this.orderModel.findById(id);
    order.delete();
  }

  async updateStatus(id: string) {
    const order = await this.orderModel.findById(id);
    return order.updateOne({ status: 'approved', updated_at: new Date() });
  }
}
