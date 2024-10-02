"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "seed", {
    enumerable: true,
    get: function() {
        return seed;
    }
});
const _faker = require("@faker-js/faker");
const _client = require("@prisma/client");
const _bcryptjs = /*#__PURE__*/ _interop_require_default(require("bcryptjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function seed(count) {
    const prisma = new _client.PrismaClient();
    const users = [];
    const status = [
        0,
        1
    ];
    const salt = await _bcryptjs.default.genSalt(10);
    const hashedPassword = await _bcryptjs.default.hash('12345678', salt);
    for(let i = 0; i < count; i++){
        users.push({
            name: _faker.faker.person.fullName(),
            email: _faker.faker.internet.email(),
            password: hashedPassword,
            status: status[Math.floor(Math.random() * status.length)]
        });
    }
    await prisma.admin.createMany({
        data: users
    });
    console.log(`${count} users have been seeded successfully.`);
    await prisma.$disconnect();
}

//# sourceMappingURL=adminSeeder.js.map