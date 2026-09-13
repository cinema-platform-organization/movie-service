import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import * as fs from "fs";
import * as path from "path";
import { Pool } from "pg";

import { categories } from "./drizzle/schema/category.schema";
import { movies } from "./drizzle/schema/movie.schema";

const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) {
	const envName = process.env.NODE_ENV || "development";
	const envFileName = `.env.${envName}.local`;
	const envPath = path.resolve(process.cwd(), envFileName);

	if (fs.existsSync(envPath)) {
		dotenv.config({ path: envPath });
		console.log(`[Seeder] Loaded environment from ${envFileName}`);
	} else {
		const fallbackPath = path.resolve(process.cwd(), ".env");
		if (fs.existsSync(fallbackPath)) {
			dotenv.config({ path: fallbackPath });
			console.log(`[Seeder] Loaded fallback environment from .env`);
		}
	}
} else {
	console.log(
		"[Seeder] Running in production. Using system environment variables.",
	);
}

const CATEGORIES = [
	{
		title: "War Movies",
		slug: "war",
	},
	{
		title: "Drama",
		slug: "drama",
	},
	{
		title: "Racing Movies",
		slug: "racing",
	},
	{
		title: "Sci-Fi",
		slug: "sci-fi",
	},
	{
		title: "Horror",
		slug: "horror",
	},
	{
		title: "Crime",
		slug: "crime",
	},
	{
		title: "Biography",
		slug: "biography",
	},
	{
		title: "Animation",
		slug: "animation",
	},
	{
		title: "Action",
		slug: "action",
	},
];

const MOVIES = [
	{
		title: "Apocalypse Now",
		slug: "apocalypse-now",
		description:
			"A US Army captain travels deep into the Cambodian jungle during the Vietnam War to confront a renegade colonel who has set himself up as a god among a local tribe.",
		poster: "/posters/apocalypse-now.webp",
		banner: "/banners/apocalypse-now.webp",
		duration: 147,
		releaseDate: new Date("1979-08-15"),
		releaseYear: 1979,
		ratingAge: 16,
		country: "USA",
		category: "war",
	},
	{
		title: "Cargo 200",
		slug: "cargo-200",
		description:
			"A grim tale set in the final months of the Soviet Union, where the collapse of a society is mirrored in one small town's descent into violence and moral decay.",
		poster: "/posters/cargo-200.webp",
		banner: "/banners/cargo-200.webp",
		duration: 89,
		releaseDate: new Date("2007-06-14"),
		releaseYear: 2007,
		ratingAge: 18,
		country: "Russia",
		category: "drama",
	},
	{
		title: "F1",
		slug: "f1",
		description:
			"A veteran Formula 1 driver comes out of retirement to mentor a rookie teammate and help save a struggling racing team from collapse.",
		poster: "/posters/f1.webp",
		banner: "/banners/f1.webp",
		duration: 155,
		releaseDate: new Date("2025-06-27"),
		releaseYear: 2025,
		ratingAge: 12,
		country: "USA",
		category: "racing",
	},
	{
		title: "The Fast and the Furious: Tokyo Drift",
		slug: "fast-and-furious-tokyo-drift",
		description:
			"A troubled teenager is sent to live with his father in Tokyo, where he becomes immersed in the underground world of drift racing and street culture.",
		poster: "/posters/fast-and-furious-tokyo-drift.webp",
		banner: "/banners/fast-and-furious-tokyo-drift.webp",
		duration: 104,
		releaseDate: new Date("2006-06-16"),
		releaseYear: 2006,
		ratingAge: 12,
		country: "USA, Japan",
		category: "racing",
	},
	{
		title: "Ford v Ferrari",
		slug: "ford-v-ferrari",
		description:
			"An American car designer and a British driver team up to build a revolutionary race car for Ford in order to defeat Ferrari at the 24 Hours of Le Mans.",
		poster: "/posters/ford-v-ferrari.webp",
		banner: "/banners/ford-v-ferrari.webp",
		duration: 152,
		releaseDate: new Date("2019-11-15"),
		releaseYear: 2019,
		ratingAge: 12,
		country: "USA",
		category: "racing",
	},
	{
		title: "Forrest Gump",
		slug: "forrest-gump",
		description:
			"The extraordinary life story of a slow-witted but kind-hearted man from Alabama, who unwittingly finds himself present at some of the defining moments of the 20th century.",
		poster: "/posters/forrest-gump.webp",
		banner: "/banners/forrest-gump.webp",
		duration: 142,
		releaseDate: new Date("1994-07-06"),
		releaseYear: 1994,
		ratingAge: 12,
		country: "USA",
		category: "drama",
	},
	{
		title: "Goodfellas",
		slug: "goodfellas",
		description:
			"The story of Henry Hill and his life in the mob, spanning his childhood entry into a Brooklyn crime family up to his eventual downfall.",
		poster: "/posters/goodfellas.webp",
		banner: "/banners/goodfellas.webp",
		duration: 146,
		releaseDate: new Date("1990-09-19"),
		releaseYear: 1990,
		ratingAge: 18,
		country: "USA",
		category: "crime",
	},
	{
		title: "Interstellar",
		slug: "interstellar",
		description:
			"As Earth becomes increasingly uninhabitable, a team of explorers undertakes a journey through a wormhole in search of a new home for humanity.",
		poster: "/posters/interstellar.webp",
		banner: "/banners/interstellar.webp",
		duration: 169,
		releaseDate: new Date("2014-11-07"),
		releaseYear: 2014,
		ratingAge: 12,
		country: "USA, UK",
		category: "sci-fi",
	},
	{
		title: "Midsommar",
		slug: "midsommar",
		description:
			"A grieving young woman travels with her boyfriend and friends to a remote Swedish village for a rare midsummer festival, which slowly reveals itself as something far more sinister.",
		poster: "/posters/midsommar.webp",
		banner: "/banners/midsommar.webp",
		duration: 148,
		releaseDate: new Date("2019-07-03"),
		releaseYear: 2019,
		ratingAge: 18,
		country: "USA, Sweden",
		category: "horror",
	},
	{
		title: "Once Upon a Time in America",
		slug: "once-upon-a-time-in-america",
		description:
			"A former Prohibition-era Jewish gangster returns to the Lower East Side of Manhattan decades later, where he must confront the ghosts and betrayals of his past.",
		poster: "/posters/once-upon-a-time-in-america.webp",
		banner: "/banners/once-upon-a-time-in-america.webp",
		duration: 229,
		releaseDate: new Date("1984-06-01"),
		releaseYear: 1984,
		ratingAge: 18,
		country: "USA, Italy",
		category: "crime",
	},
	{
		title: "Oppenheimer",
		slug: "oppenheimer",
		description:
			"The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.",
		poster: "/posters/oppenheimer.webp",
		banner: "/banners/oppenheimer.webp",
		duration: 180,
		releaseDate: new Date("2023-07-21"),
		releaseYear: 2023,
		ratingAge: 16,
		country: "USA",
		category: "biography",
	},
	{
		title: "Spider-Man: Into the Spider-Verse",
		slug: "spider-man-into-the-spider-verse",
		description:
			"Teenager Miles Morales becomes the Spider-Man of his universe and must team up with alternate versions of the hero from other dimensions to save his city.",
		poster: "/posters/spider-man-into-the-spider-verse.webp",
		banner: "/banners/spider-man-into-the-spider-verse.webp",
		duration: 117,
		releaseDate: new Date("2018-12-14"),
		releaseYear: 2018,
		ratingAge: 6,
		country: "USA",
		category: "animation",
	},
	{
		title: "The Godfather",
		slug: "the-godfather",
		description:
			"The aging patriarch of an organized crime dynasty transfers control of his empire to his reluctant son, drawing him into a world of power, loyalty, and blood.",
		poster: "/posters/the-godfather.webp",
		banner: "/banners/the-godfather.webp",
		duration: 175,
		releaseDate: new Date("1972-03-24"),
		releaseYear: 1972,
		ratingAge: 18,
		country: "USA",
		category: "crime",
	},
	{
		title: "The Godfather Part II",
		slug: "the-godfather-2",
		description:
			"The continuing saga of the Corleone family, tracing both the rise of a young Vito Corleone and the moral decline of his son Michael as he consolidates power.",
		poster: "/posters/the-godfather-2.webp",
		banner: "/banners/the-godfather-2.webp",
		duration: 202,
		releaseDate: new Date("1974-12-20"),
		releaseYear: 1974,
		ratingAge: 18,
		country: "USA",
		category: "crime",
	},
	{
		title: "The Green Mile",
		slug: "the-green-mile",
		description:
			"A death row prison guard forms an unlikely bond with an inmate who possesses a mysterious and extraordinary gift.",
		poster: "/posters/the-green-mile.webp",
		banner: "/banners/the-green-mile.webp",
		duration: 189,
		releaseDate: new Date("1999-12-10"),
		releaseYear: 1999,
		ratingAge: 16,
		country: "USA",
		category: "drama",
	},
	{
		title: "The Shawshank Redemption",
		slug: "the-shawshank-redemption",
		description:
			"A young banker wrongly convicted of murder forms a deep friendship with a fellow inmate over the course of two decades in prison.",
		poster: "/posters/the-shawshank-redemption.webp",
		banner: "/banners/the-shawshank-redemption.webp",
		duration: 142,
		releaseDate: new Date("1994-09-23"),
		releaseYear: 1994,
		ratingAge: 16,
		country: "USA",
		category: "drama",
	},
	{
		title: "The Truman Show",
		slug: "the-truman-show",
		description:
			"An insurance salesman gradually discovers that his entire life is a nonstop, elaborately staged television show broadcast around the world.",
		poster: "/posters/the-truman-show.webp",
		banner: "/banners/the-truman-show.webp",
		duration: 103,
		releaseDate: new Date("1998-06-05"),
		releaseYear: 1998,
		ratingAge: 12,
		country: "USA",
		category: "drama",
	},
	{
		title: "The World's Fastest Indian",
		slug: "the-worlds-fastest-indian",
		description:
			"An elderly New Zealand motorcycle enthusiast spends years restoring a vintage Indian motorcycle and travels to Utah to attempt a land speed record at the Bonneville Salt Flats.",
		poster: "/posters/the-worlds-fastest-indian.webp",
		banner: "/banners/the-worlds-fastest-indian.webp",
		duration: 127,
		releaseDate: new Date("2005-10-13"),
		releaseYear: 2005,
		ratingAge: 12,
		country: "New Zealand, USA",
		category: "biography",
	},
	{
		title: "Top Gun: Maverick",
		slug: "top-gun-maverick",
		description:
			'After more than thirty years of service, elite pilot Pete "Maverick" Mitchell must confront his past while training a new generation of Top Gun graduates for a dangerous mission.',
		poster: "/posters/top-gun-maverick.webp",
		banner: "/banners/top-gun-maverick.webp",
		duration: 130,
		releaseDate: new Date("2022-05-27"),
		releaseYear: 2022,
		ratingAge: 12,
		country: "USA",
		category: "action",
	},
];

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

	console.log("Seeding categories...");

	await db
		.insert(categories)
		.values([...CATEGORIES])
		.onConflictDoNothing();

	const dbCategories = await db.select().from(categories);
	const categoryMap = new Map(dbCategories.map(c => [c.slug, c.id]));

	console.log("Seeding movies...");

	await db
		.insert(movies)
		.values(
			MOVIES.map(movie => ({
				...movie,
				categoryId: movie.category
					? (categoryMap.get(movie.category) ?? null)
					: null,
			})),
		)
		.onConflictDoNothing();

	console.log("Seed completed!");

	client.release();
	process.exit(0);
}

main();
