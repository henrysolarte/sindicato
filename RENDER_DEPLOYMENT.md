# Deployment to Render Guide

## Prerequisites

- GitHub account with the sindicato repository
- Render account (https://render.com)
- MySQL database credentials (if using external database)

## Automatic Deployment

This project is configured for automatic deployment to Render using `render.yaml`.

### Services Deployed

1. **sindicato-db** (MySQL Database)
   - Free tier with 1GB disk
   - Automatically provisioned with initial schema
   - Environment: `sindicato`

2. **sindicato-api** (Node.js Backend)
   - Serves API endpoints
   - Connects to MySQL database
   - Runs on port 5000

3. **sindegeologico-web** (Static Frontend)
   - React + Vite application
   - Serves the main website

4. **formulario-sgc-web** (Static Frontend)
   - React + Vite application
   - Serves the SGC form

## Deployment Steps

### 1. Create Blueprint on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Blueprint"**
3. Select the `sindicato` repository from GitHub
4. Confirm that Render detects the `render.yaml` file
5. Click **"Create Blueprint"**

### 2. Configure Environment Variables

During blueprint creation, Render will prompt for:

```
MYSQL_ROOT_PASSWORD    = [your secure password]
MYSQL_USER            = [database user]
MYSQL_PASSWORD        = [database password]
```

**Important Security Notes:**
- Use strong, unique passwords
- Never share these values
- Store them securely

### 3. Deploy

1. Click **"Create New Deployment"**
2. Render will automatically:
   - Provision MySQL database
   - Build and deploy the API
   - Build and deploy frontend services
   - Set up SSL/HTTPS for all services

### 4. Verify Deployment

Once deployed, check:

- **API Health**: `https://sindicato-api.onrender.com/api/test-connection`
- **Frontend**: `https://sindegeologico-web.onrender.com`
- **Form**: `https://formulario-sgc-web.onrender.com`

## Database Initialization

The database schema is automatically created when the database service starts. The schema includes:

- `usuarios` - User accounts
- `actas` - Minutes/Acts
- `comunicados` - Communications
- `noticias` - News items

## Maintenance

### Updating Code

Push changes to the `master` branch of your GitHub repository. Render will automatically:

1. Detect the push
2. Build new versions of services
3. Deploy without downtime

### Scaling

If you need to upgrade from free to paid tier:

1. Go to service settings on Render Dashboard
2. Click **"Settings"** → **"Plan"**
3. Select a paid plan with higher resource limits

### Database Backups

Free tier databases do not include automatic backups. For production use, consider:

- Upgrading to a paid database plan
- Regular manual exports
- Setting up a backup service

## Troubleshooting

### API Not Connecting to Database

1. Check database credentials in Environment Variables
2. Verify database service is running (green status on Dashboard)
3. Check service logs: Dashboard → Service → "Logs"

### Frontend Shows 404

Ensure `index.html` is properly configured as the fallback route in `render.yaml`.

### Deployment Fails

1. Check build logs in Render Dashboard
2. Verify all dependencies are listed in `package.json`
3. Ensure `.env.example` has all required variables

## Using External Database

If you prefer to use an external MySQL host (e.g., AWS RDS, ClearDB):

1. Edit `render.yaml` - remove the `sindicato-db` service
2. Set environment variables manually in Render Dashboard:
   ```
   DB_HOST       = your-external-db-host
   DB_USER       = your-db-user
   DB_PASSWORD   = your-db-password
   DB_NAME       = sindicato
   DB_PORT       = 3306
   ```
3. Run migrations manually on your external database

## Support

- Render Docs: https://render.com/docs
- GitHub: https://github.com/henrysolarte/sindicato
