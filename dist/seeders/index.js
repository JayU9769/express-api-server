"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const prompts_1 = require("@inquirer/prompts");
async function seed() {
    try {
        const entity = await (0, prompts_1.select)({
            message: 'What would you like to seed?',
            choices: [
                {
                    name: 'Users',
                    value: 'users',
                    description: 'Create Dummy users',
                },
                {
                    name: 'Admins',
                    value: 'admins',
                    description: 'Create Dummy Admins',
                },
            ],
        });
        const countNumber = await (0, prompts_1.number)({
            message: 'How many records would you like to create?',
        });
        // Dynamically import the correct seeder module
        const seederMap = {
            users: './userSeeder',
            admins: './adminSeeder',
        };
        const seederModule = seederMap[entity];
        if (seederModule) {
            const { seed } = await Promise.resolve(`${seederModule}`).then(s => __importStar(require(s)));
            await seed(countNumber);
        }
        else {
            console.error('Unknown entity selected.');
        }
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
seed();
//# sourceMappingURL=index.js.map