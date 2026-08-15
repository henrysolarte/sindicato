# Configuración de Base de Datos MySQL en Railway

Render no soporta MySQL directo en blueprints. Usaremos **Railway** (gratis, fácil).

## Pasos:

### 1. Crear Base de Datos en Railway

1. Ve a https://railway.app
2. Login con GitHub (la misma cuenta)
3. Click **"New Project"** → **"Provision MySQL"**
4. Crea la base de datos

### 2. Obtener Credenciales

Una vez creada, Railway te mostrará:
```
Database URL: mysql://[USER]:[PASSWORD]@[HOST]:3306/[DATABASE]
```

De ahí extraes:
- **DB_HOST** → El host (sin puerto)
- **DB_USER** → El usuario
- **DB_PASSWORD** → La contraseña
- **DB_NAME** → El nombre de la BD (generalmente `railway`)
- **DB_PORT** → 3306

### 3. En Render - Configurar Variables

Cuando despliegues en Render, en las variables de entorno agrega:

```
DB_HOST      = [tu-host-railway]
DB_USER      = [tu-usuario]
DB_PASSWORD  = [tu-contraseña]
DB_NAME      = [nombre-bd]
DB_PORT      = 3306
```

### 4. Ejecutar Migraciones

Después de deploy, ejecuta las migraciones:
- Usa una herramienta como MySQL Workbench o CLI
- Ejecuta el SQL en: `back/migrations/000_init_database.sql`

## Alternativa: Usar ClearDB

Si prefieres, ClearDB es otra opción (también gratis con plan Heroku).

## Alternativa: Cambiar a PostgreSQL

Render soporta PostgreSQL mejor. Si lo prefieres, podemos cambiar la base de datos completa a PostgreSQL.

¿Cuál prefieres?
