"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionController = void 0;
const typedi_1 = require("typedi");
const role_service_1 = require("@/services/role.service");
const permission_service_1 = require("@/services/permission.service");
const HttpException_1 = require("@/exceptions/HttpException");
/**
 * Controller handling permission-related HTTP requests.
 */
class PermissionController {
    constructor() {
        this.role = typedi_1.Container.get(role_service_1.RoleService);
        this.permission = typedi_1.Container.get(permission_service_1.PermissionService);
        /**
         * Retrieves a paginated list of permissions based on query parameters.
         * Supports pagination, filtering, sorting, and search.
         * @method get
         * @param req Express request object
         * @param res Express response object
         * @param next Express next function for error handling
         */
        this.getPermissions = async (req, res, next) => {
            try {
                const type = req.query.type;
                if (!type) {
                    throw new HttpException_1.HttpException(422, 'Type is Required');
                }
                const permissions = await this.permission.findAll(type);
                const roleHasPermissions = await this.permission.findAllRoleHasPermissions();
                const roles = await this.role.findAll(type);
                // Respond with the fetched data
                res.status(200).json({
                    data: {
                        permissions,
                        roles,
                        roleHasPermissions,
                    },
                    message: 'findAll',
                });
            }
            catch (error) {
                // Pass any errors to the next error handling middleware
                next(error);
            }
        };
        this.updatePermission = async (req, res, next) => {
            try {
                const body = req.body;
                await this.permission.updatePermission(body);
                // Respond with success message
                res.status(200).json({ message: 'Permission updated' });
            }
            catch (error) {
                // Pass any errors to the next error handling middleware
                next(error);
            }
        };
    }
}
exports.PermissionController = PermissionController;
//# sourceMappingURL=permission.controller.js.map