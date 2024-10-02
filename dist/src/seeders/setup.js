"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _client = require("@prisma/client");
const _bcryptjs = /*#__PURE__*/ _interop_require_default(require("bcryptjs"));
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
let Setup = class Setup {
    async init() {
        console.info('Setup Started...');
        await Promise.all([
            this.insertRoles(),
            this.insertAdmins(),
            this.insertPermissions()
        ]);
        this.assignPermissionsToRole();
        await this.assignRoleToAdmin();
        console.info('Setup Complete...');
    }
    async insertRoles() {
        console.info('Inserting Roles...');
        await this.prisma.role.createMany({
            data: this.defaultRoles,
            skipDuplicates: true
        });
    }
    async insertPermissions() {
        console.info('Inserting Permissions...');
        const parentPermissions = this.defaultPermissions.filter((p)=>!p.parentId);
        const childPermissions = this.defaultPermissions.filter((p)=>p.parentId);
        await this.prisma.permission.createMany({
            data: parentPermissions,
            skipDuplicates: true
        });
        const parentRecords = await this.prisma.permission.findMany({
            where: {
                name: {
                    in: parentPermissions.map((p)=>p.name)
                }
            },
            select: {
                id: true,
                name: true
            }
        });
        const parentMap = new Map(parentRecords.map((p)=>[
                p.name,
                p.id
            ]));
        await this.prisma.permission.createMany({
            data: childPermissions.map((p)=>_object_spread_props(_object_spread({}, p), {
                    parentId: parentMap.get(p.parentId)
                })),
            skipDuplicates: true
        });
    }
    async insertAdmins() {
        console.info('Inserting Admins...');
        await this.prisma.admin.createMany({
            data: this.defaultAdmins,
            skipDuplicates: true
        });
    }
    async assignRoleToAdmin() {
        console.info('Assigning roles to admins...');
        const [admins, roles] = await Promise.all([
            this.prisma.admin.findMany({
                where: {
                    email: {
                        in: this.defaultAdmins.map((admin)=>admin.email)
                    }
                },
                select: {
                    id: true
                }
            }),
            this.prisma.role.findMany({
                where: {
                    name: {
                        in: this.rolesForAdmin
                    }
                },
                select: {
                    id: true
                }
            })
        ]);
        if (admins.length && roles.length) {
            const modelHasRole = admins.flatMap((admin)=>roles.map((role)=>({
                        roleId: role.id,
                        modelType: 'admin',
                        modelId: admin.id,
                        createdAt: this.timestamp,
                        updatedAt: this.timestamp
                    })));
            await this.prisma.modelHasRole.createMany({
                data: modelHasRole,
                skipDuplicates: true
            });
        }
    }
    async assignPermissionsToRole() {
        console.info('Assigning permissions to roles...');
        const roles = await this.prisma.role.findMany({
            where: {
                type: _client.UserType.admin,
                isSystem: 1
            },
            select: {
                id: true
            }
        });
        const permissions = await this.prisma.permission.findMany({
            where: {
                type: _client.UserType.admin,
                parentId: {
                    not: null
                }
            },
            select: {
                id: true
            }
        });
        const roleHasPermissions = roles.flatMap((role)=>permissions.map((permission)=>({
                    roleId: role.id,
                    permissionId: permission.id
                })));
        await this.prisma.roleHasPermission.createMany({
            data: roleHasPermissions
        });
    }
    constructor(){
        _define_property(this, "prisma", new _client.PrismaClient());
        _define_property(this, "defaultPassword", '12345678');
        _define_property(this, "timestamp", new Date());
        _define_property(this, "defaultRoles", [
            {
                name: 'admin',
                type: 'admin',
                status: 1,
                isSystem: 1,
                createdAt: this.timestamp,
                updatedAt: this.timestamp
            }
        ]);
        _define_property(this, "rolesForAdmin", [
            'admin'
        ]);
        _define_property(this, "defaultPermissions", [
            {
                name: 'role',
                type: 'admin',
                parentId: null,
                createdAt: this.timestamp,
                updatedAt: this.timestamp
            },
            {
                name: 'admin',
                type: 'admin',
                parentId: null,
                createdAt: this.timestamp,
                updatedAt: this.timestamp
            },
            {
                name: 'user',
                type: 'admin',
                parentId: null,
                createdAt: this.timestamp,
                updatedAt: this.timestamp
            },
            {
                name: 'admin-dashboard',
                type: 'admin',
                parentId: 'admin',
                createdAt: this.timestamp,
                updatedAt: this.timestamp
            },
            ...[
                'create',
                'view',
                'update',
                'delete'
            ].flatMap((action)=>[
                    'role',
                    'admin',
                    'user'
                ].map((parent)=>({
                        name: `${parent}-${action}`,
                        type: 'admin',
                        parentId: parent,
                        createdAt: this.timestamp,
                        updatedAt: this.timestamp
                    }))),
            {
                name: 'admin-permission',
                type: 'admin',
                parentId: 'admin',
                createdAt: this.timestamp,
                updatedAt: this.timestamp
            }
        ]);
        _define_property(this, "defaultAdmins", [
            {
                email: 'admin@admin.com',
                name: 'Admin',
                password: _bcryptjs.default.hashSync(this.defaultPassword),
                status: 1,
                isSystem: 1,
                createdAt: this.timestamp,
                updatedAt: this.timestamp
            }
        ]);
    }
};
new Setup().init();

//# sourceMappingURL=setup.js.map