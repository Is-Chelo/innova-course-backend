import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { convertToSlug, paginate } from 'src/helpers';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createProductDto: CreateProductDto) {
    const slug = convertToSlug(createProductDto.name);
    const productExits = await this.prisma.product.findFirst({
      where: { slug },
    });
    if (productExits)
      throw new BadRequestException(
        'Ya existe un producto con ese nombre y slug',
      );
    await this.prisma.product.create({
      data: {
        ...createProductDto,
        slug: slug,
      },
    });
    return {
      message: 'Producto Creada',
      data: null,
    };
  }

  async findAll(pagination: PaginationDto) {
    const { page = 1, limit = 10, orderBy = 'desc' } = pagination;

    const countProducts = await this.prisma.product.count();

    const products = await this.prisma.product.findMany({
      skip: (page - 1) * limit,
      take: limit,

      orderBy: {
        updatedAt: orderBy,
      },
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    const { totalItems, lastPage } = paginate(countProducts, limit);
    return {
      message: 'Productos obtenidos',
      data: {
        products,
        paginate: {
          totalItems,
          page,
          lastPage,
        },
      },
    };
  }

  async findOne(term: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        id: term,
      },
    });

    if (product == null)
      throw new NotFoundException(
        'El producto no existe no ese identificador no existe.',
      );
    return {
      message: 'Categoria obtenida',
      data: {
        product,
      },
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);
    if (updateProductDto.name) {
      updateProductDto.slug = convertToSlug(updateProductDto.name);
    }

    const productUpdate = await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });

    return {
      message: 'Producto Actualizada',
      data: productUpdate,
    };
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.product.delete({
      where: { id },
    });
    return { message: 'Se elimino', data: [] };
  }
}
