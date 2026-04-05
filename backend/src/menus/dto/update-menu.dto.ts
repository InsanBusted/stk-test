import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateMenuDto {
  @IsString()
  name!: string;
}
