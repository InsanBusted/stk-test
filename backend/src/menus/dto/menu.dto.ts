import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class MoveMenuDto {
  @IsString()
  @ApiProperty({
    example: 'cm1abc124',
    description: 'ID of the new parent menu. Pass null to move to root.',
    nullable: true,
  })
  newParentId!: string | null;
}

export class ReorderMenuDto {
  @IsInt()
  @ApiProperty({
    example: 2,
    description: 'New order position among sibling menus',
  })
  newOrder!: number;
}
