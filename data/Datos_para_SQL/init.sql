-- Table 1: Countries
CREATE TABLE IF NOT EXISTS pais_envejecimiento (
    id_pais SERIAL PRIMARY KEY,
    nombre_pais VARCHAR(100),
    capital VARCHAR(100),
    continente VARCHAR(50),
    region VARCHAR(100),
    poblacion DOUBLE PRECISION,
    tasa_de_envejecimiento DECIMAL(5,2)
);

-- Table 2: Cost of Living
CREATE TABLE IF NOT EXISTS pais_poblacion (
    id SERIAL PRIMARY KEY,
    _id VARCHAR(25),
    continente VARCHAR(50),
    pais VARCHAR(100),
    poblacion DOUBLE PRECISION,
    costo_bajo_hospedaje DECIMAL(10,2),
    costo_promedio_comida DECIMAL(10,2),
    costo_bajo_transporte DECIMAL(10,2),
    costo_promedio_entretenimiento DECIMAL(10,2)
);

-- Load CSV Data into Tables
COPY pais_envejecimiento(id_pais, nombre_pais, capital, continente, region, poblacion, tasa_de_envejecimiento)
FROM '/docker-entrypoint-initdb.d/pais_envejecimiento.csv'
DELIMITER ',' CSV HEADER;

COPY pais_poblacion(_id, continente, pais, poblacion, costo_bajo_hospedaje, costo_promedio_comida, costo_bajo_transporte, costo_promedio_entretenimiento)
FROM '/docker-entrypoint-initdb.d/pais_poblacion.csv'
DELIMITER ',' CSV HEADER;