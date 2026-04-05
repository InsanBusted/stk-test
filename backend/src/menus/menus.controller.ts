import {
  Controller, Get, Post, Put, Patch, Delete,
  Param, Body
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody
} from '@nestjs/swagger';
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { MoveMenuDto, ReorderMenuDto } from './dto/menu.dto';

@ApiTags('Menus')
@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  //  POST /menus
  @Post()
  @ApiOperation({
    summary: 'Create a new menu',
    description: 'Creates a new menu item. Can be a root menu or a child of an existing menu by providing `parentId`.',
  })
  @ApiBody({ type: CreateMenuDto })
  @ApiResponse({
    status: 201,
    description: 'Menu successfully created.',
    schema: {
      example: {
        id: 'cm1abc123',
        name: 'Dashboard',
        parentId: null,
        order: 0,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request – invalid or missing fields.' })
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menusService.create(createMenuDto);
  }

  //  GET /menus
  @Get()
  @ApiOperation({
    summary: 'Get all menus (flat list)',
    description: 'Returns all menu items as a flat array without hierarchy.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all menus.',
    schema: {
      example: [
        { id: 'cm1abc123', name: 'Dashboard', parentId: null, order: 0 },
        { id: 'cm1abc124', name: 'Settings', parentId: null, order: 1 },
        { id: 'cm1abc125', name: 'Profile', parentId: 'cm1abc124', order: 0 },
      ],
    },
  })
  findAll() {
    return this.menusService.findAll();
  }

  //  GET /menus/tree
  @Get('tree')
  @ApiOperation({
    summary: 'Get all menus as a tree',
    description:
      'Returns all menus structured as a nested tree. Each node includes `id`, `name`, `depth`, `parentId`, `parentName`, and optional `children`.',
  })
  @ApiResponse({
    status: 200,
    description: 'Nested tree of all menus.',
    schema: {
      example: [
        {
          id: 'cm1abc123',
          name: 'Dashboard',
          depth: 0,
          parentId: null,
          parentName: null,
        },
        {
          id: 'cm1abc124',
          name: 'Settings',
          depth: 0,
          parentId: null,
          parentName: null,
          children: [
            {
              id: 'cm1abc125',
              name: 'Profile',
              depth: 1,
              parentId: 'cm1abc124',
              parentName: 'Settings',
            },
          ],
        },
      ],
    },
  })
  findAllTree() {
    return this.menusService.findAllTree();
  }

  //  GET /menus/:id
  @Get(':id')
  @ApiOperation({
    summary: 'Get a menu by ID',
    description: 'Returns a single menu item by its unique ID.',
  })
  @ApiParam({ name: 'id', description: 'The unique ID of the menu', example: 'cm1abc123' })
  @ApiResponse({
    status: 200,
    description: 'Menu found.',
    schema: {
      example: {
        id: 'cm1abc123',
        name: 'Dashboard',
        parentId: null,
        order: 0,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Menu not found.' })
  findOne(@Param('id') id: string) {
    return this.menusService.findOne(id);
  }

  //  PUT /menus/:id
  @Put(':id')
  @ApiOperation({
    summary: 'Update a menu',
    description: 'Updates the `name` of an existing menu item.',
  })
  @ApiParam({ name: 'id', description: 'The unique ID of the menu to update', example: 'cm1abc123' })
  @ApiBody({ type: UpdateMenuDto })
  @ApiResponse({
    status: 200,
    description: 'Menu successfully updated.',
    schema: {
      example: {
        id: 'cm1abc123',
        name: 'Home',
        parentId: null,
        order: 0,
        updatedAt: '2024-06-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request – ID is missing or invalid body.' })
  @ApiResponse({ status: 404, description: 'Menu not found.' })
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menusService.update(id, updateMenuDto);
  }

  //  PATCH /menus/:id/move
  @Patch(':id/move')
  @ApiOperation({
    summary: 'Move a menu to a new parent',
    description:
      'Changes the `parentId` of a menu. Pass `newParentId: null` to promote the menu to root level. Cannot move a menu to itself or to one of its own descendants.',
  })
  @ApiParam({ name: 'id', description: 'The unique ID of the menu to move', example: 'cm1abc123' })
  @ApiBody({
    type: MoveMenuDto,
    examples: {
      moveToParent: {
        summary: 'Move under another menu',
        value: { newParentId: 'cm1abc124' },
      },
      moveToRoot: {
        summary: 'Promote to root level',
        value: { newParentId: null },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Menu successfully moved.',
    schema: {
      example: {
        id: 'cm1abc123',
        name: 'Dashboard',
        parentId: 'cm1abc124',
        order: 0,
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request – cannot move to self or descendant.' })
  @ApiResponse({ status: 404, description: 'Menu or new parent not found.' })
  move(@Param('id') id: string, @Body() dto: MoveMenuDto) {
    return this.menusService.move(id, dto.newParentId);
  }

  //  PATCH /menus/:id/reorder 
  @Patch(':id/reorder')
  @ApiOperation({
    summary: 'Update the order of a menu',
    description:
      'Sets a new `order` value for a menu item. Menus with lower order values appear first among siblings.',
  })
  @ApiParam({ name: 'id', description: 'The unique ID of the menu to reorder', example: 'cm1abc123' })
  @ApiBody({
    type: ReorderMenuDto,
    examples: {
      reorder: {
        summary: 'Set order to 2',
        value: { newOrder: 2 },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Menu order successfully updated.',
    schema: {
      example: {
        id: 'cm1abc123',
        name: 'Dashboard',
        parentId: null,
        order: 2,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Menu not found.' })
  reorder(@Param('id') id: string, @Body() dto: ReorderMenuDto) {
    return this.menusService.reorder(id, dto.newOrder);
  }

  //  DELETE /menus/:id
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a menu and its descendants',
    description:
      'Deletes a menu item and **all of its children recursively**. This action is irreversible.',
  })
  @ApiParam({ name: 'id', description: 'The unique ID of the menu to delete', example: 'cm1abc123' })
  @ApiResponse({
    status: 200,
    description: 'Menu and all its descendants successfully deleted.',
    schema: {
      example: { count: 3 },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request – ID is missing.' })
  @ApiResponse({ status: 404, description: 'Menu not found.' })
  remove(@Param('id') id: string) {
    return this.menusService.remove(id);
  }
}