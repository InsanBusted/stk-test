import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateMenuDto {
  @IsString()
  @ApiPropertyOptional({ example: 'Home', description: 'New display name for the menu' })
  name!: string;
}
