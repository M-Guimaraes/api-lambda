import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum OrderStatus {
  Approved = 'approved',
  Pending = 'pending',
}

export type OrderDocuemnt = Order & Document;

@Schema()
export class Order {
  @Prop()
  id: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: OrderStatus.Pending })
  status: OrderStatus;

  @Prop({ type: Date, default: Date.now })
  created_at: string;

  @Prop({ type: Date, default: Date.now })
  updated_at: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
