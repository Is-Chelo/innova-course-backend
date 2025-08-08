import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order-dto';
import { Server, Socket } from 'socket.io';
import { BadRequestException } from '@nestjs/common';

@WebSocketGateway({
  namespace: '/orders',
  cors: {
    origin: '*',
  },
})
export class OrdersGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly ordersService: OrdersService) {}

  async handleConnection(client: Socket) {
    console.log('cliente conectado', client.id);
    const orders = await this.ordersService.findAll();
    this.server.emit('refreshOrders', { orders });
  }

  @SubscribeMessage('createOrder')
  async create(@MessageBody() createOrderDto: CreateOrderDto) {
    try {
      const createOrder = await this.ordersService.create(createOrderDto);
      const orders = await this.ordersService.findAll();

      this.server.emit('refreshOrders', { orders });
      return createOrder;
    } catch (error) {
      if (error instanceof BadRequestException) {
        return { status: 'error', message: error.message };
      }
      return { status: 'error', message: 'Ocurrió un error inesperado.' };
    }
  }
}
