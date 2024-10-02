"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = seed;
const tslib_1 = require("tslib");
const faker_1 = require("@faker-js/faker");
const client_1 = require("@prisma/client");
const bcryptjs_1 = tslib_1.__importDefault(require("bcryptjs"));
async function seed(count) {
    const prisma = new client_1.PrismaClient();
    const users = [];
    const status = [0, 1];
    // Generate a salt
    const salt = await bcryptjs_1.default.genSalt(10);
    const hashedPassword = await bcryptjs_1.default.hash('12345678', salt);
    for (let i = 0; i < count; i++) {
        users.push({
            name: faker_1.faker.person.fullName(),
            email: faker_1.faker.internet.email(),
            phoneNo: faker_1.faker.phone.number(),
            password: hashedPassword,
            status: status[Math.floor(Math.random() * status.length)],
        });
    }
    await prisma.user.createMany({
        data: users,
    });
    console.log(`${count} users have been seeded successfully.`);
    await prisma.$disconnect(); // Close the Prisma client connection
}
//# sourceMappingURL=userSeeder.js.map