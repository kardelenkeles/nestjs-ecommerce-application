import { Inject, Injectable } from "@nestjs/common";
import { ProductEntity } from "../entity/product.entity";
import { ProductDto } from "../entity/dto/product.dto";
import { UpdateProductDto } from "../entity/dto/updateProduct.dto";

@Injectable()
export class ProductService {
  constructor(
    @Inject("PRODUCT_REPOSITORY")
    private productRepository: typeof ProductEntity
  ) {
  }

  async getAllProducts(): Promise<ProductEntity[]> {
    return await this.productRepository.findAll<ProductEntity>();
  }

  async getOneProduct(id: string): Promise<ProductEntity> {
    return this.productRepository.findOne({ where: { id } });
  }


  async createProduct(productDto: ProductDto): Promise<ProductEntity> {
    return this.productRepository.create({
      productName: productDto.productName,
      details: productDto.details,
      productImage: productDto.productImage,
      price: productDto.price,
      discount: productDto.discount
    });
  }

  async updateProduct(id: number, data: Partial<UpdateProductDto>) {
    const existingProduct = await this.productRepository.findOne({ where: { id } });
    if (!existingProduct) {
      throw new Error("Product not found");
    }
    return await this.productRepository.update(data, { where: { id } });
  }


  async deleteProduct(id: number): Promise<any> {
    await this.productRepository.destroy({ where: { id } });
  }


}
