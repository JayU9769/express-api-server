"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "HomeController", {
    enumerable: true,
    get: function() {
        return HomeController;
    }
});
const _roleservice = require("../services/role.service");
const _userservice = require("../services/user.service");
const _typedi = /*#__PURE__*/ _interop_require_default(require("typedi"));
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
let HomeController = class HomeController {
    mapList(items, { id, text }) {
        return items.map((item)=>({
                value: item[id],
                label: item[text]
            }));
    }
    mapValue(item, { id, text }) {
        return {
            value: item[id],
            label: item[text]
        };
    }
    constructor(){
        _define_property(this, "roleService", _typedi.default.get(_roleservice.RoleService));
        _define_property(this, "userService", _typedi.default.get(_userservice.UserService));
        _define_property(this, "searchList", async (req, res, next)=>{
            try {
                const { type, q } = req.query;
                const searchTerm = (q === null || q === void 0 ? void 0 : q.toLowerCase()) || '';
                if (!type) {
                    return res.status(400).json({
                        message: 'Type is required',
                        data: []
                    });
                }
                const searchResults = await this.getSearchResults(type, searchTerm);
                const message = searchResults.length > 0 ? `${(type === null || type === void 0 ? void 0 : type.charAt(0).toUpperCase()) + (type === null || type === void 0 ? void 0 : type.slice(1))} Fetch` : 'Not Found';
                return res.status(200).json({
                    data: searchResults,
                    message
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "searchValue", async (req, res, next)=>{
            try {
                const { type, value } = req.query;
                if (!type) {
                    return res.status(400).json({
                        message: 'Type is required',
                        data: []
                    });
                }
                const searchValue = await this.getSearchValue(type, value);
                const message = searchValue ? `${(type === null || type === void 0 ? void 0 : type.charAt(0).toUpperCase()) + (type === null || type === void 0 ? void 0 : type.slice(1))} Found` : 'Not Found';
                return res.status(200).json({
                    data: searchValue,
                    message
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "getSearchResults", async (type, searchTerm)=>{
            let items = [];
            let textKey = 'name';
            switch(type){
                case 'roles':
                    items = await this.roleService.query.findMany({
                        select: {
                            id: true,
                            name: true
                        },
                        where: _object_spread({
                            status: 1
                        }, searchTerm && {
                            name: {
                                startsWith: searchTerm
                            }
                        }),
                        orderBy: {
                            name: 'asc'
                        },
                        take: 25
                    });
                    textKey = 'name';
                    break;
                case 'users':
                    items = await this.userService.query.findMany({
                        select: {
                            id: true,
                            name: true
                        },
                        where: _object_spread({
                            status: 1
                        }, searchTerm && {
                            name: {
                                contains: searchTerm
                            }
                        }),
                        orderBy: {
                            name: 'asc'
                        },
                        take: 25
                    });
                    textKey = 'name';
                    break;
                default:
                    return [];
            }
            return this.mapList(items, {
                id: 'id',
                text: textKey
            });
        });
        _define_property(this, "getSearchValue", async (type, value)=>{
            let item = {};
            switch(type){
                case 'roles':
                    item = await this.roleService.findById(value);
                    return this.mapValue(item, {
                        id: 'id',
                        text: 'name'
                    });
                    break;
                case 'users':
                    item = await this.userService.findById(value);
                    return this.mapValue(item, {
                        id: 'id',
                        text: 'name'
                    });
                default:
            }
            return {};
        });
    }
};

//# sourceMappingURL=home.controller.js.map