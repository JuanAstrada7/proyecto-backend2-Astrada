import { IsMongoId, IsInt, IsPositive } from 'class-validator';

export class AddProductToCartDto {
  @IsMongoId()
  readonly productId: string;

  @IsInt()
  @IsPositive()
  readonly quantity: number;
}