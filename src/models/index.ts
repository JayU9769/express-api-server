import {dbConfig} from "@/config";
import {Sequelize} from "sequelize-typescript";
import {User} from "@/models/users.model";


const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password,{
  dialect: 'mysql',
  database: dbConfig.database,
  host: dbConfig.host,
  port: Number(dbConfig.port) || 3306,
  models: [User]
});

export default sequelize;