import {dbConfig} from "@/config";
import {Sequelize} from "sequelize-typescript";
import {User} from "@/models/user.model";


const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password,{
  dialect: 'mysql',
  database: dbConfig.database,
  host: dbConfig.host,
  port: Number(dbConfig.port) || 3306,
  models: [User],
  logging: false
});

export default sequelize;