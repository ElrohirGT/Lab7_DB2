# Lab7_DB2

## Ejecutando el proyecto

```bash
docker compose up --build   // Inicia las BD, usando los scripts de initialización
docker compose down         // Apaga los contenedores, la info de las BD es guardada en disco
docker compose down -v      // Apaga los contenedores y borra los datos que contenian las BD
```

A continuación se encuentran 

**mongo_source DB**
```
    URI : mongodb://localhost:27018/turistic_costs
```

**pg_source DB**
```
    USER: admin
    PASSWORD: 1234
    PORT: 5432
```

**datawarehouse DB**
```
    USER: admin
    PASSWORD: 1234
    PORT: 5433
```