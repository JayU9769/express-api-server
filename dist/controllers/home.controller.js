"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeController = void 0;
const tslib_1 = require("tslib");
const role_service_1 = require("@/services/role.service");
const user_service_1 = require("@/services/user.service");
const typedi_1 = tslib_1.__importDefault(require("typedi"));
/**
 * Controller handling admin-related HTTP requests.
 */
class HomeController {
    constructor() {
        this.roleService = typedi_1.default.get(role_service_1.RoleService);
        this.userService = typedi_1.default.get(user_service_1.UserService);
        /**
         * @description Handles search list API.
         * @param req - Express request object.
         * @param res - Express response object.
         * @param next - Express next function to pass control to the next middleware.
         * @returns A JSON response with a success message and admin data or an error.
         */
        this.searchList = async (req, res, next) => {
            try {
                const { type, q } = req.query;
                const searchTerm = (q === null || q === void 0 ? void 0 : q.toLowerCase()) || '';
                if (!type) {
                    return res.status(400).json({ message: 'Type is required', data: [] });
                }
                const searchResults = await this.getSearchResults(type, searchTerm);
                const message = searchResults.length > 0 ? `${(type === null || type === void 0 ? void 0 : type.charAt(0).toUpperCase()) + (type === null || type === void 0 ? void 0 : type.slice(1))} Fetch` : 'Not Found';
                return res.status(200).json({ data: searchResults, message });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * @description Handles search value API.
         * @param req - Express request object.
         * @param res - Express response object.
         * @param next - Express next function to pass control to the next middleware.
         * @returns A JSON response with a success message and admin data or an error.
         */
        this.searchValue = async (req, res, next) => {
            try {
                const { type, value } = req.query;
                if (!type) {
                    return res.status(400).json({ message: 'Type is required', data: [] });
                }
                const searchValue = await this.getSearchValue(type, value);
                const message = searchValue ? `${(type === null || type === void 0 ? void 0 : type.charAt(0).toUpperCase()) + (type === null || type === void 0 ? void 0 : type.slice(1))} Found` : 'Not Found';
                return res.status(200).json({ data: searchValue, message });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Retrieves search results based on type and search term.
         * @param type - The type of data to search for (roles or users).
         * @param searchTerm - The search keyword in lowercase.
         * @returns A list of formatted search results.
         */
        this.getSearchResults = async (type, searchTerm) => {
            let items = [];
            let textKey = 'name'; // Default key for text
            switch (type) {
                case 'roles':
                    items = await this.roleService.query.findMany({
                        select: { id: true, name: true },
                        where: Object.assign({ status: 1 }, (searchTerm && { name: { startsWith: searchTerm } })),
                        orderBy: { name: 'asc' },
                        take: 25,
                    });
                    textKey = 'name';
                    break;
                case 'users':
                    items = await this.userService.query.findMany({
                        select: { id: true, name: true },
                        where: Object.assign({ status: 1 }, (searchTerm && { name: { contains: searchTerm } })),
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
        this.getSearchValue = async (type, value) => {
            let item = {};
            switch (type) {
                case 'roles':
                    item = await this.roleService.findById(value);
                    return this.mapValue(item, { id: 'id', text: 'name' });
                    break;
                case 'users':
                    item = await this.userService.findById(value);
                    return this.mapValue(item, { id: 'id', text: 'name' });
                default:
            }
            return {};
        };
    }
    /**
     * Maps the items to the desired structure.
     * @param items - The list of items.
     * @param keys - Object mapping for id and textKey.
     * @returns A mapped list of items.
     */
    mapList(items, { id, text }) {
        return items.map(item => ({
            value: item[id],
            label: item[text], // Dynamically maps the `text` key
        }));
    }
    mapValue(item, { id, text }) {
        return {
            value: item[id],
            label: item[text], // Dynamically maps the `text` key
        };
    }
}
exports.HomeController = HomeController;
//# sourceMappingURL=home.controller.js.map