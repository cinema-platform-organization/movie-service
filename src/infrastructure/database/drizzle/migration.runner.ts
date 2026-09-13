import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import * as fs from "fs";
import * as path from "path";
import { Pool } from "pg";

const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) {
	const envName = process.env.NODE_ENV || "development";
	const envFileName = `.env.${envName}.local`;
	const envPath = path.resolve(process.cwd(), envFileName);

	if (fs.existsSync(envPath)) {
		dotenv.config({ path: envPath });
		console.log(`[Migrations] Loaded environment from ${envFileName}`);
	} else {
		const fallbackPath = path.resolve(process.cwd(), ".env");
		if (fs.existsSync(fallbackPath)) {
			dotenv.config({ path: fallbackPath });
			console.log(`[Migrations] Loaded fallback environment from .env`);
		}
	}
} else {
	console.log(
		"[Migrations] Running in production. Using system environment variables.",
	);
}

const pool = new Pool({
	host: process.env.DATABASE_HOST,
	port: Number(process.env.DATABASE_PORT),
	user: process.env.DATABASE_USERNAME,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME,
});

async function main() {
	const client = await pool.connect();
	const db = drizzle(client);

	console.log("Running Drizzle migrations...");

	await migrate(db, {
		migrationsFolder: process.env.DRIZZLE_OUT ?? "./drizzle",
	});

	console.log("Migrations completed!");

	client.release();
	process.exit(0);
}

main();
