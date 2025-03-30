import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { convertToSlug } from 'src/helpers';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const slug = convertToSlug(createCategoryDto.name);

    const categoryExits = await this.prisma.product.findFirst({
      where: { slug },
    });
    if (categoryExits)
      throw new BadRequestException(
        'Ya existe un producto con ese nombre y slug',
      );

    const category_exists = await this.prisma.category.findFirst({
      where: {
        name: createCategoryDto.name,
      },
    });
    if (category_exists) {
      throw new BadRequestException(
        'Ya existe una categoria con el mismo nombre.',
      );
    }

    await this.prisma.category.create({
      data: {
        description: createCategoryDto.description,
        name: createCategoryDto.name,
        slug: createCategoryDto.name,
      },
    });
    return {
      message: 'Categoria Creada',
      data: null,
    };
  }

  async findAll() {
    const categories = await this.prisma.category.findMany();
    return {
      message: 'Categorias obtenida',
      data: {
        categories,
      },
    };
  }

  async findOne(term: string) {
    const category = await this.prisma.category.findFirst({
      where: {
        id: term,
      },
      include: {
        products: true,
      },
    });

    if (category == null)
      throw new NotFoundException(
        'La categoria no ese identificador no existe.',
      );
    return {
      message: 'Categoria obtenida',
      data: {
        category,
      },
    };
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);
    const categoryUpdate = await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });

    return {
      message: 'Categoria Actualizada',
      data: categoryUpdate,
    };
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.category.delete({
      where: { id },
    });
    return { message: 'Se elimino', data: [] };
  }
}
