import { IsMongoId, IsInt, IsPositive, IsOptional } from 'class-validator';

export class RemoveProductFromCartDto {
  @IsMongoId()
  readonly productId: string;

  @IsInt()
  @IsPositive()
  @IsOptional() // Si no se especifica, se elimina todo el producto
  readonly quantity?: number;
}