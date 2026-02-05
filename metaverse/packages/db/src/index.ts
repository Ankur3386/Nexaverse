import dotenv from "dotenv";
import path, { dirname } from "path";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { fileURLToPath } from "url";
//so in http when node rn @repo/db it call for index.ts file path but for env it should go to env file so configing env file path
const __filename = fileURLToPath(import.meta.url);
console.log(__filename);
const __dirname = path.dirname(__filename);
console.log(__dirname);
console.log("hi",path.resolve(__dirname, "../.env"))
dotenv.config({
  path: path.resolve(__dirname, "../.env")
});

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing (db package)");
}
const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaPg({ connectionString })
const client = new PrismaClient({ adapter })

export { client }