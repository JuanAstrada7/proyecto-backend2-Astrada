import { IsMongoId, IsInt, IsPositive, IsOptional } from 'class-validator';

export class RemoveProductFromCartDto {
  @IsMongoId()
  readonly productId: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  readonly quantity?: number;
}