import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateOptions, PaginateResult } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  Product,
  type ProductDocument,
  type ProductPaginateModel,
} from './schemas/product.schema';
import { ConfigService } from '@nestjs/config';

export interface PaginatedProductsResponse {
  status: 'success' | 'error';
  payload: ProductDocument[];
  totalPages: number;
  prevPage: number | null;
  nextPage: number | null;
  page: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevLink: string | null;
  nextLink: string | null;
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: ProductPaginateModel,
    private readonly configService: ConfigService,
  ) { }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async findAll(
    limit: number,
    page: number,
    sort?: string,
    query?: string,
  ): Promise<PaginatedProductsResponse> {
    const filter: Record<string, any> = query ? JSON.parse(query) : {};
    const options: PaginateOptions = {
      page,
      limit,
      sort: sort ? { price: sort as 'asc' | 'desc' } : undefined,
      lean: true,
    };

    const result: PaginateResult<ProductDocument> =
      await this.productModel.paginate(filter, options);

    const serverUrl = this.configService.get<string>('SERVER_URL');
    const url = `${serverUrl}/api/products`;

    return {
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage ?? null,
      nextPage: result.nextPage ?? null,
      page: result.page ?? 1,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `${url}?page=${result.prevPage}&limit=${limit}`
        : null,
      nextLink: result.hasNextPage
        ? `${url}?page=${result.nextPage}&limit=${limit}`
        : null,
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();
    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return updatedProduct;
  }

  async remove(id: string): Promise<{ deleted: boolean; id: string }> {
    const result = await this.productModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return { deleted: true, id };
  }
}