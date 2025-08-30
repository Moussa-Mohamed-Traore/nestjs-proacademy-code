import { registerAs } from "@nestjs/config";

export default registerAs("database", () => ({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  name: process.env.DB_NAME || "test",
  synchronize: process.env.DB_SYNC === "true" ? true : false,
  autoLoadEntities: process.env.AUTO_LOAD === "true" ? true : false,
}));
