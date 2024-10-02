"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _prompts = require("@inquirer/prompts");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
async function seed() {
    try {
        const entity = await (0, _prompts.select)({
            message: 'What would you like to seed?',
            choices: [
                {
                    name: 'Users',
                    value: 'users',
                    description: 'Create Dummy users'
                },
                {
                    name: 'Admins',
                    value: 'admins',
                    description: 'Create Dummy Admins'
                }
            ]
        });
        const countNumber = await (0, _prompts.number)({
            message: 'How many records would you like to create?'
        });
        const seederMap = {
            users: './userSeeder',
            admins: './adminSeeder'
        };
        const seederModule = seederMap[entity];
        if (seederModule) {
            const { seed } = await Promise.resolve(seederModule).then((p)=>/*#__PURE__*/ _interop_require_wildcard(require(p)));
            await seed(countNumber);
        } else {
            console.error('Unknown entity selected.');
        }
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
seed();

//# sourceMappingURL=index.js.map