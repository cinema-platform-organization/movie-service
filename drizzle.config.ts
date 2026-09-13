import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";
import * as fs from "fs";
import * as path from "path";

const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) {
	const envName = process.env.NODE_ENV || "development";
	const envFileName = `.env.${envName}.local`;
	const envPath = path.resolve(process.cwd(), envFileName);

	if (fs.existsSync(envPath)) {
		dotenv.config({ path: envPath });
		console.log(`[Drizzle Config] Loaded environment from ${envFileName}`);
	} else {
		const fallbackPath = path.resolve(process.cwd(), ".env");
		if (fs.existsSync(fallbackPath)) {
			dotenv.config({ path: fallbackPath });
			console.log(
				`[Drizzle Config] Loaded fallback environment from .env`,
			);
		}
	}
} else {
	console.log(
		"[Drizzle Config] Running in production. Using system environment variables.",
	);
}

export default defineConfig({
	out: process.env.DRIZZLE_OUT ?? "./drizzle",
	schema: "./src/infrastructure/database/drizzle/schema",
	dialect: "postgresql",
	dbCredentials: {
		host: process.env.DATABASE_HOST,
		port: Number(process.env.DATABASE_PORT),
		user: process.env.DATABASE_USERNAME,
		password: process.env.DATABASE_PASSWORD,
		database: process.env.DATABASE_NAME,
		ssl:
			process.env.DATABASE_SSL === "true"
				? { rejectUnauthorized: false }
				: false,
	},
	verbose: true,
	strict: true,
});
