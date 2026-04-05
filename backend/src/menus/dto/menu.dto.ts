import { IsInt, IsString } from 'class-validator';

export class MoveMenuDto {
  @IsString()
  newParentId!: string | null;
}

export class ReorderMenuDto {
  @IsInt()
  newOrder!: number;
}
