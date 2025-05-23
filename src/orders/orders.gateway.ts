import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order-dto';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: '/orders' })
export class OrdersGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly ordersService: OrdersService) {}

  @SubscribeMessage('createOrder')
  async create(@MessageBody() createOrderDto: CreateOrderDto) {
    await this.ordersService.create(createOrderDto);
    const orders = await this.ordersService.findAll();
    this.server.emit('refreshOrders', { orders });
  }
}
