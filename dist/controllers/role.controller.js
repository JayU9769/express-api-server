"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleController = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
const role_service_1 = require("@/services/role.service");
/**
 * Controller handling role-related HTTP requests.
 */
class RoleController {
    constructor() {
        this.role = typedi_1.Container.get(role_service_1.RoleService);
        /**
         * Retrieves a paginated list of roles based on query parameters.
         * Supports pagination, filtering, sorting, and search.
         * @method get
         * @param req Express request object
         * @param res Express response object
         * @param next Express next function for error handling
         */
        this.getRoles = async (req, res, next) => {
            var _a;
            try {
                // Destructure query parameters with default values
                const _b = req.query, { pageNumber = 0, perPage = 10, sort = 'createdAt', order = 'ASC' } = _b, filters = tslib_1.__rest(_b, ["pageNumber", "perPage", "sort", "order"]);
                // Prepare options for pagination and filtering
                const options = {
                    pageNumber: Number(pageNumber) + 1,
                    perPage: Number(perPage),
                    filters: filters,
                    q: req.query.q,
                    ignoreGlobal: ((_a = req.query.ignoreGlobal) === null || _a === void 0 ? void 0 : _a.split(',')) || [],
                    sort: String(sort),
                    order: String(order).toUpperCase(),
                };
                // Fetch paginated role data
                const findAllRolesData = await this.role.findAllPaginate(options);
                // Respond with the fetched data
                res.status(200).json({ data: findAllRolesData, message: 'findAll' });
            }
            catch (error) {
                // Pass any errors to the next error handling middleware
                next(error);
            }
        };
        /**
         * Retrieves a single role by its ID.
         * @method get
         * @param req Express request object with role ID in params
         * @param res Express response object
         * @param next Express next function for error handling
         */
        this.getRoleById = async (req, res, next) => {
            try {
                const roleId = req.params.id;
                // Find role by ID
                const findOneRoleData = await this.role.findById(roleId);
                // Respond with the fetched role data
                res.status(200).json({ data: findOneRoleData, message: 'findOne' });
            }
            catch (error) {
                // Pass any errors to the next error handling middleware
                next(error);
            }
        };
        /**
         * Creates a new role with provided data.
         * @method post
         * @param req Express request object with role data in body
         * @param res Express response object
         * @param next Express next function for error handling
         */
        this.createRole = async (req, res, next) => {
            try {
                const roleData = req.body;
                // Create new role
                const createRoleData = await this.role.create(roleData);
                // Respond with the created role data
                res.status(201).json({ data: createRoleData, message: 'created' });
            }
            catch (error) {
                // Pass any errors to the next error handling middleware
                next(error);
            }
        };
        /**
         * Updates an existing role with provided data.
         * @method put
         * @param req Express request object with role ID in params and role data in body
         * @param res Express response object
         * @param next Express next function for error handling
         */
        this.updateRole = async (req, res, next) => {
            try {
                const roleId = req.params.id;
                const roleData = req.body;
                // Update role by ID
                const updateRoleData = await this.role.update(roleId, roleData);
                // Respond with the updated role data
                res.status(200).json({ data: updateRoleData, message: 'updated' });
            }
            catch (error) {
                // Pass any errors to the next error handling middleware
                next(error);
            }
        };
        /**
         * Deletes a role by its ID.
         * @method delete
         * @param req Express request object with role ID in params
         * @param res Express response object
         * @param next Express next function for error handling
         */
        this.deleteRole = async (req, res, next) => {
            try {
                const roleIds = req.body.ids;
                // Delete role by ID
                await this.role.delete(roleIds);
                // Respond with success message
                res.status(200).json({ message: 'deleted' });
            }
            catch (error) {
                // Pass any errors to the next error handling middleware
                next(error);
            }
        };
        /**
         * Single action a role by its ID & Type.
         * @method post
         * @param req Express request object with role ID in params
         * @param res Express response object
         * @param next Express next function for error handling
         */
        this.updateAction = async (req, res, next) => {
            try {
                const { ids, field } = req.body;
                await this.role.updateAction({ ids, field });
                // Respond with success message
                res.status(200).json({ message: 'Updated Bulk Action' });
            }
            catch (error) {
                // Pass any errors to the next error handling middleware
                next(error);
            }
        };
    }
}
exports.RoleController = RoleController;
//# sourceMappingURL=role.controller.js.map