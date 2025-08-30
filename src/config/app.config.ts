
import { registerAs } from "@nestjs/config"
export const appConfig = registerAs("appConfig", () => ({
    environnement: process.env.NODE_ENV || "production",
}));