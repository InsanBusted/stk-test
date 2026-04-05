import { Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { PrismaService } from 'src/database/prisma.service';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenusService {
  constructor(private readonly prisma: PrismaService) {}
  private buildTree(menus: any[]) {
    const map = new Map<
      string,
      {
        id: string;
        name: string;
        parentId: string | null;
        order: number;
        children: any[];
      }
    >();

    menus.forEach((menu) => {
      map.set(menu.id, {
        id: menu.id,
        name: menu.name,
        parentId: menu.parentId,

        order: menu.order ?? 0,
        children: [],
      });
    });

    const tree: any[] = [];

    menus.forEach((menu) => {
      const node = map.get(menu.id);
      if (!node) return;

      if (menu.parentId && map.has(menu.parentId)) {
        map.get(menu.parentId)!.children.push(node);
      } else {
        tree.push(node);
      }
    });

    const clean = (nodes: any[], depth = 0): any[] => {
      return nodes
        .sort((a, b) => a.order - b.order)
        .map((n) => {
          const result: any = {
            id: n.id,
            name: n.name,
            depth,
            parentId: n.parentId,
            parentName: n.parentId ? (map.get(n.parentId)?.name ?? null) : null,
          };

          if (n.children && n.children.length > 0) {
            result.children = clean(n.children, depth + 1);
          }

          return result;
        });
    };

    return clean(tree);
  }

  findAll() {
    return this.prisma.menu.findMany();
  }

  async findAllTree() {
    const menus = await this.prisma.menu.findMany({
      orderBy: { order: 'asc' },
    });

    return this.buildTree(menus);
  }

  create(dto: CreateMenuDto) {
    const data = {
      name: dto.name,
      parentId: dto.parentId ?? null,
      order: dto.order ?? 0,
    };

    return this.prisma.menu.create({ data });
  }

  findOne(id: string) {
    return this.prisma.menu.findUnique({
      where: { id },
    });
  }

  update(id: string, dto: UpdateMenuDto) {
    if (!id) {
      throw new Error('ID is required for update');
    }

    return this.prisma.menu.update({
      where: { id },
      data: {
        name: dto.name,
      },
    });
  }

  async remove(id: string) {
    if (!id) {
      throw new Error('ID is required for delete');
    }

    // ambil semua menu
    const menus = await this.prisma.menu.findMany({
      select: { id: true, parentId: true },
    });

    const map = new Map<string, string[]>();

    menus.forEach((m) => {
      if (!m.parentId) return;

      if (!map.has(m.parentId)) {
        map.set(m.parentId, []);
      }

      map.get(m.parentId)!.push(m.id);
    });

    const toDelete: string[] = [];

    const collect = (menuId: string) => {
      toDelete.push(menuId);

      const children = map.get(menuId) || [];
      children.forEach(collect);
    };

    collect(id);

    // delete sekaligus
    return this.prisma.menu.deleteMany({
      where: {
        id: {
          in: toDelete,
        },
      },
    });
  }

  async move(id: string, newParentId: string | null) {
    if (id === newParentId) {
      throw new Error('Menu cannot be its own parent');
    }

    const menu = await this.prisma.menu.findUnique({ where: { id } });

    if (!menu) {
      throw new Error('Menu not found');
    }

    if (newParentId) {
      const newParent = await this.prisma.menu.findUnique({
        where: { id: newParentId },
      });
      if (!newParent) {
        throw new Error('New parent menu not found');
      }
    }

    const children = await this.prisma.menu.findMany({
      where: { parentId: id },
      select: { id: true },
    });

    if (children.some((c) => c.id === newParentId)) {
      throw new Error('Cannot move menu to its own descendant');
    }

    return this.prisma.menu.update({
      where: { id },
      data: { parentId: newParentId },
    });
  }

  async reorder(id: string, newOrder: number) {
    const menu = await this.prisma.menu.findUnique({ where: { id } });
    if (!menu) {
      throw new Error('Menu not found');
    }

    return this.prisma.menu.update({
      where: { id },
      data: { order: newOrder },
    });
  }
}
