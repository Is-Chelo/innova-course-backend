import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order-dto';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productService: ProductsService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { orderItems } = createOrderDto;
    // Validar que todos los productos del array existan
    const productIds = createOrderDto.orderItems.map((product) => {
      return product.productId;
    });

    const productIdsExist = await this.prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });
    if (productIds.length !== productIdsExist.length) {
      throw new BadRequestException('No se encontro un producto.');
    }

    // Actualizamos el stock
    productIdsExist.map((product, index) => {
      if (product.stock < orderItems[index].quantity) {
        throw new BadRequestException('No hay stock sucifiente.');
      }
    });

    productIdsExist.map(async (product, index) => {
      const newStock = product.stock - orderItems[index].quantity;
      await this.productService.update(product.id, {
        stock: newStock,
      });
    });

    // Guardamos la orden
    const newOrder = await this.prisma.order.create({
      data: createOrderDto,
    });

    return {
      message: 'Orden Registrada.',
      order: newOrder,
    };
  }

  async findAll() {
    const orders = await this.prisma.order.findMany();
    return orders;
  }
}
