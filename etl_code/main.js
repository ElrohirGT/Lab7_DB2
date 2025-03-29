import pg from "pg";
const { Client } = pg;
import { MongoClient } from "mongodb";

// PG Connection...
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

/**
 * @typedef {Object} ETLRow
 * @property {string} id
 * @property {string} continente
 * @property {string} pais
 * @property {string} capital
 * @property {string} region
 * @property {string} poblacion
 * @property {string} tasaEnvejecimiento
 * @property {string} costoBajoHospedaje
 * @property {string} costoPromedioComida
 * @property {string} costoBajoTransporte
 * @property {string} costoPromedioEntretenimiento
 */

/**
 * @param {ETLRow} data
 * @param {Client} conn
 */
async function insertETLRow(conn, data) {
	const query =
		"insert into metrics ( continente, pais, capital, region, poblacion, tasa_de_envejecimiento, costo_bajo_hospedaje, costo_promedio_comida, costo_bajo_transporte, costo_promedio_entretenimiento) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)";
	const params = [
		data.continente,
		data.pais,
		data.capital,
		data.region,
		data.poblacion,
		data.tasaEnvejecimiento,
		data.costoBajoHospedaje,
		data.costoPromedioComida,
		data.costoBajoTransporte,
		data.costoPromedioEntretenimiento,
	];

	return conn.query(query, params);
}

try {
	await PG_RESULT_CLIENT.connect();
	PG_RESULT_CLIENT.query("DELETE FROM metrics;", []);
	await PG_SOURCE_CLIENT.connect();

	const database = MONGO_SOURCE_CLIENT.db("turistic_costs");
	const movies = database.collection("general_costs");

	// Migrate MongoDB data...
	const query = {};
	const cursor = movies.find(query);
	while (await cursor.hasNext()) {
		const next = await cursor.next();
		if (next === null) {
			throw new Error("NEXT CANT BE NULL!");
		}

		const costos = next.costos_diarios_estimados_en_dólares;
		/** @type {ETLRow} */
		const data = {
			continente: next.continente,
			pais: next.país,
			capital: next.capital,
			region: next.región,
			poblacion: next.población,
			tasaEnvejecimiento: next.tasaEnvejecimiento,
			costoBajoHospedaje: costos?.hospedaje?.precio_bajo_usd,
			costoPromedioComida: costos?.comida?.precio_promedio_usd,
			costoBajoTransporte: costos?.transporte?.precio_bajo_usd,
			costoPromedioEntretenimiento:
				costos?.entretenimiento?.precio_promedio_usd,
		};

		await insertETLRow(PG_RESULT_CLIENT, data);
	}

	// Migrate PostgresDB data...
	const result = await PG_SOURCE_CLIENT.query(
		`select 
	pp.continente ,
	pp.pais ,
	pe.capital ,
	pe.region ,
	pe.poblacion ,
	pe.tasa_de_envejecimiento ,
	pp.costo_bajo_hospedaje ,
	pp.costo_promedio_comida ,
	pp.costo_bajo_transporte ,
	pp.costo_promedio_entretenimiento 
from pais_poblacion pp 
left join pais_envejecimiento pe on pe.nombre_pais = pp.pais`,
		[],
	);

	for (let i = 0; i < result.rowCount; i++) {
		const row = result.rows[i];
		/** @type{ETLRow} */
		const data = {
			continente: row.continente,
			pais: row.pais,
			capital: row.capital,
			region: row.region,
			poblacion: row.poblacion,
			tasaEnvejecimiento: row.tasa_de_envejecimiento,
			costoBajoHospedaje: row.costo_bajo_hospedaje,
			costoPromedioComida: row.costo_promedio_comida,
			costoBajoTransporte: row.costo_bajo_transporte,
			costoPromedioEntretenimiento: row.costo_promedio_entretenimiento,
		};
		await insertETLRow(PG_RESULT_CLIENT, data);
	}
} catch (e) {
	console.error(e);
} finally {
	await PG_RESULT_CLIENT.end();
	await PG_SOURCE_CLIENT.end();
	await MONGO_SOURCE_CLIENT.close();
}

console.log("Done!");
