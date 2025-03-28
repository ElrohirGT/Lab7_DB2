
CREATE TABLE IF NOT EXISTS metrics (
    id SERIAL PRIMARY KEY,
    continente VARCHAR(30),
    pais VARCHAR(30),
    capital VARCHAR(45),
    region VARCHAR(30),
    poblacion INT,
    tasa_de_envejecimiento DECIMAL(5,2),
    costo_bajo_hospedaje DECIMAL(10,2),
    costo_promedio_comida DECIMAL(10,2),
    costo_bajo_transporte DECIMAL(10,2),
    costo_promedio_entretenimiento DECIMAL(10,2)
)