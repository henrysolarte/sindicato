# Backend - SINDEGEOLÓGICO

Backend Node.js + Express para conexión con SQL Server

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar las variables de entorno en `.env`:
```
DB_SERVER=localhost (o tu servidor SQL)
DB_USER=sa (tu usuario SQL)
DB_PASSWORD=YourPassword123 (tu contraseña)
DB_NAME=sindegeologico
DB_PORT=1433
PORT=5000
```

3. Iniciar el servidor:
```bash
npm start          # Producción
npm run dev        # Desarrollo (con nodemon)
```

## Endpoints disponibles

- `GET /api/health` - Verificar que la API funciona
- `GET /api/test-connection` - Probar conexión a SQL Server

## Estructura

```
back/
├── config/
│   └── database.js      # Configuración de conexión SQL Server
├── routes/
│   └── ejemplo.js       # Rutas de ejemplo
├── server.js            # Servidor principal
├── package.json
├── .env                 # Variables de entorno
└── README.md
```

## Conexión con el Frontend

En el frontend, llamar a los endpoints así:

```javascript
fetch('http://localhost:5000/api/test-connection')
  .then(res => res.json())
  .then(data => console.log(data))
```
