import pg from "pg";
import { MongoClient } from "mongodb";

// PG Connection...
const { Client } = pg;
const PG_RESULT_CLIENT = new Client({
	user: "admin",
	password: "1234",
	host: "localhost",
	port: 5433,
	database: "metrics",
});

const PG_SOURCE_CLIENT = new Client({
	user: "admin",
	password: "1234",
	host: "localhost",
	port: 5434,
	database: "countries",
});

// MONGODB Connection...
// Replace the uri string with your connection string.
const uri = "mongodb://localhost:27018/turistic_costs";
const MONGO_SOURCE_CLIENT = new MongoClient(uri);

try {
	const database = MONGO_SOURCE_CLIENT.db("turistic_costs");
	const movies = database.collection("general_costs");

	// Query for a movie that has the title 'Back to the Future'
	const query = {};
	const movie = await movies.findOne(query);

	console.log(movie);
	await PG_RESULT_CLIENT.connect();
	await PG_SOURCE_CLIENT.connect();
} catch (e) {
	console.error(e);
} finally {
	await PG_RESULT_CLIENT.end();
	await PG_SOURCE_CLIENT.end();
	await MONGO_SOURCE_CLIENT.close();
}

console.log("Hello world!");
