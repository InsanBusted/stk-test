import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateMenuDto {
  @IsString()
  name!: string;

  @IsInt()
  order!: number;

  @IsOptional()
  @IsString()
  parentId?: string;
}
