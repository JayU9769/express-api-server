"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserService", {
    enumerable: true,
    get: function() {
        return UserService;
    }
});
const _bcrypt = require("bcrypt");
const _typedi = require("typedi");
const _HttpException = require("../exceptions/HttpException");
const _baseservice = require("./base/base.service");
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
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let UserService = class UserService extends _baseservice.BaseService {
    async findAll() {
        return this.prisma.user.findMany();
    }
    async findById(userId) {
        const findUser = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!findUser) throw new _HttpException.HttpException(409, "User doesn't exist");
        return findUser;
    }
    async create(data) {
        const findUser = await this.prisma.user.findUnique({
            where: {
                email: data.email
            }
        });
        if (findUser) throw new _HttpException.HttpException(409, `This email ${data.email} already exists`);
        const hashedPassword = await (0, _bcrypt.hash)(data.password, 10);
        delete data.id;
        return this.prisma.user.create({
            data: _object_spread_props(_object_spread({}, data), {
                password: hashedPassword
            })
        });
    }
    async update(userId, data) {
        const findUser = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!findUser) {
            throw new _HttpException.HttpException(404, `User with ID ${userId} not found`);
        }
        if (data.email && data.email.toLowerCase() !== findUser.email.toLowerCase()) {
            const existingUserWithEmail = await this.prisma.user.findUnique({
                where: {
                    email: data.email
                }
            });
            if (existingUserWithEmail) {
                throw new _HttpException.HttpException(409, `Email ${data.email} is already in use by another user`);
            }
        }
        if (data.password) {
            const hashedPassword = await (0, _bcrypt.hash)(data.password, 10);
            data = _object_spread_props(_object_spread({}, data), {
                password: hashedPassword
            });
        }
        return this.prisma.user.update({
            where: {
                id: userId
            },
            data: data
        });
    }
    async delete(userIds) {
        const result = await this.prisma.user.deleteMany({
            where: {
                id: {
                    in: userIds
                }
            }
        });
        if (!result.count) throw new _HttpException.HttpException(409, "User doesn't exist");
        return true;
    }
    async updatePasswordWithoutCurrent(userId, newPassword) {
        const admin = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!admin) {
            throw new Error('Admin not found');
        }
        const isNewMatch = await _bcryptjs.default.compare(newPassword, admin.password);
        if (isNewMatch) {
            throw new Error('New password is already used in the past');
        }
        const hashedPassword = await _bcryptjs.default.hash(newPassword, 10);
        await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                password: hashedPassword
            }
        });
    }
    constructor(){
        super('User'), _define_property(this, "query", this.prisma.user);
    }
};
UserService = _ts_decorate([
    (0, _typedi.Service)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], UserService);

//# sourceMappingURL=user.service.js.map