import { RoleService } from '@/services/role.service';
import { UserService } from '@/services/user.service';
import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

/**
 * Controller handling admin-related HTTP requests.
 */
export class HomeController {
  private roleService = Container.get(RoleService);
  private userService = Container.get(UserService);

  /**
   * @description Handles search list API.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function to pass control to the next middleware.
   * @returns A JSON response with a success message and admin data or an error.
   */
  public searchList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type, q } = req.query;
      const searchTerm = (q as string)?.toLowerCase() || '';

      if (!type) {
        return res.status(400).json({ message: 'Type is required', data: [] });
      }

      const searchResults = await this.getSearchResults(type as string, searchTerm);
      const message = searchResults.length > 0 ? `${(type as string)?.charAt(0).toUpperCase() + (type as string)?.slice(1)} Fetch` : 'Not Found';

      return res.status(200).json({ data: searchResults, message });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieves search results based on type and search term.
   * @param type - The type of data to search for (roles or users).
   * @param searchTerm - The search keyword in lowercase.
   * @returns A list of formatted search results.
   */
  private getSearchResults = async (type: string, searchTerm: string) => {
    let items = [];
    let textKey = 'name'; // Default key for text

    switch (type) {
      case 'roles':
        items = await this.roleService.query.findMany({
          select: { id: true, name: true },
          where: { status: 1, ...(searchTerm && { name: { startsWith: searchTerm } }) },
          orderBy: { name: 'asc' },
          take: 25,
        });
        textKey = 'name';
        break;

      case 'users':
        items = await this.userService.query.findMany({
          select: { id: true, name: true },
          where: { status: 1, ...(searchTerm && { name: { contains: searchTerm } }) },
          orderBy: { name: 'asc' },
          take: 25,
        });
        textKey = 'name';
        break;

      default:
        return [];
    }

    return this.mapList(items, { id: 'id', text: textKey });
  };

  /**
   * Maps the items to the desired structure.
   * @param items - The list of items.
   * @param keys - Object mapping for id and textKey.
   * @returns A mapped list of items.
   */
  private mapList(items: any[], { id, text }: { id: string; text: string }) {
    return items.map(item => ({
      id: item[id],
      text: item[text], // Dynamically maps the `text` key
    }));
  }
}
