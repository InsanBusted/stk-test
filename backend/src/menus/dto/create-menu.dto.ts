import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateMenuDto {
  @IsString()
  @ApiProperty({
    example: 'Dashboard',
    description: 'Display name of the menu',
  })
  name!: string;

  @ApiPropertyOptional({
    example: 0,
    description: 'Sort order among siblings (lower = first)',
    default: 0,
  })
  @IsInt()
  order!: number;

  @ApiPropertyOptional({
    example: 'cm1abc124',
    description: 'ID of the parent menu. Omit for root-level menu.',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  parentId?: string;
}
