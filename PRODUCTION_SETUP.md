# Production Setup Guide for ShopDaraz Hub

This guide will help you set up the complete production environment with database, backend API, and frontend.

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (React/Vite)  │◄──►│   (Node.js)     │◄──►│   (PostgreSQL)  │
│   Port: 3000    │    │   Port: 5000    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📋 **Prerequisites**

- Node.js 18+ and npm
- PostgreSQL 13+
- Git
- PM2 (for process management)
- Nginx (for reverse proxy)
- SSL Certificate (Let's Encrypt)

## 🗄️ **Database Setup**

### 1. Install PostgreSQL

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**CentOS/RHEL:**
```bash
sudo yum install postgresql-server postgresql-contrib
sudo postgresql-setup initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

### 2. Create Database and User

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE shopdaraz;
CREATE USER shopdaraz_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE shopdaraz TO shopdaraz_user;
\q
```

### 3. Run Database Schema

```bash
# Connect to database
psql -U shopdaraz_user -d shopdaraz -h localhost

# Run the schema
\i database/schema.sql
```

## 🚀 **Backend Setup**

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

```bash
# Copy environment template
cp env.example .env

# Edit configuration
nano .env
```

**Required Environment Variables:**
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shopdaraz
DB_USER=shopdaraz_user
DB_PASSWORD=your_secure_password

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com

# JazzCash
JAZZCASH_MERCHANT_ID=your_merchant_id
JAZZCASH_PASSWORD=your_password
JAZZCASH_INTEGRITY_SALT=your_salt
JAZZCASH_API_URL=https://payments.jazzcash.com.pk/ApplicationAPI/API/Payment/DoTransaction
```

### 3. Start Backend

```bash
# Development
npm run dev

# Production
npm start
```

## 🌐 **Frontend Setup**

### 1. Update API Configuration

Create `src/config/api.js`:
```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.yourdomain.com' 
  : 'http://localhost:5000';

export default API_BASE_URL;
```

### 2. Update Cart Context for API Integration

Replace localStorage with API calls in `src/contexts/CartContext.tsx`:

```javascript
// Add API integration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const addToCart = async (product, quantity = 1) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user?.token}`
      },
      body: JSON.stringify({
        productId: product.id,
        quantity
      })
    });
    
    if (response.ok) {
      // Refresh cart from server
      await loadCartFromServer();
    }
  } catch (error) {
    console.error('Add to cart error:', error);
  }
};
```

## 🔧 **Production Deployment**

### 1. Using PM2 (Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'shopdaraz-backend',
    script: 'src/server.js',
    cwd: './backend',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Start application
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 2. Nginx Configuration

```nginx
# /etc/nginx/sites-available/shopdaraz
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # Frontend
    location / {
        root /var/www/shopdaraz/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔒 **Security Checklist**

### Database Security
- [ ] Change default PostgreSQL password
- [ ] Enable SSL connections
- [ ] Create dedicated database user
- [ ] Regular backups
- [ ] Firewall rules (only allow app server)

### Application Security
- [ ] Strong JWT secret
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Input validation
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] HTTPS only

### Server Security
- [ ] Firewall configured
- [ ] SSH key authentication
- [ ] Regular security updates
- [ ] Fail2ban installed
- [ ] Log monitoring

## 📊 **Monitoring & Logging**

### 1. Application Monitoring

```bash
# PM2 monitoring
pm2 monit

# Logs
pm2 logs shopdaraz-backend
```

### 2. Database Monitoring

```sql
-- Check active connections
SELECT count(*) FROM pg_stat_activity;

-- Check database size
SELECT pg_size_pretty(pg_database_size('shopdaraz'));

-- Check slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

## 🚀 **Performance Optimization**

### 1. Database Optimization
- Add indexes for frequently queried columns
- Regular VACUUM and ANALYZE
- Connection pooling
- Query optimization

### 2. Application Optimization
- Enable gzip compression
- CDN for static assets
- Image optimization
- Caching strategies

### 3. Frontend Optimization
- Code splitting
- Lazy loading
- Bundle optimization
- Service workers

## 🔄 **Backup Strategy**

### 1. Database Backup

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U shopdaraz_user -h localhost shopdaraz > /backups/shopdaraz_$DATE.sql
gzip /backups/shopdaraz_$DATE.sql

# Keep only last 30 days
find /backups -name "shopdaraz_*.sql.gz" -mtime +30 -delete
```

### 2. Application Backup

```bash
# Backup application files
tar -czf /backups/shopdaraz_app_$(date +%Y%m%d).tar.gz /var/www/shopdaraz/
```

## 🧪 **Testing in Production**

### 1. Health Checks

```bash
# Backend health
curl https://api.yourdomain.com/health

# Database connectivity
curl https://api.yourdomain.com/api/health/db
```

### 2. Load Testing

```bash
# Install Apache Bench
sudo apt install apache2-utils

# Test API endpoints
ab -n 1000 -c 10 https://api.yourdomain.com/api/health
```

## 📈 **Scaling Considerations**

### 1. Horizontal Scaling
- Load balancer (HAProxy/Nginx)
- Multiple app servers
- Database read replicas
- Redis for session storage

### 2. Vertical Scaling
- Increase server resources
- Database optimization
- Caching layers

## 🆘 **Troubleshooting**

### Common Issues

1. **Database Connection Failed**
   - Check PostgreSQL service
   - Verify credentials
   - Check firewall rules

2. **API Not Responding**
   - Check PM2 status
   - Review logs
   - Check port availability

3. **Frontend Build Issues**
   - Check Node.js version
   - Clear node_modules
   - Check environment variables

### Log Locations
- Application logs: `./backend/logs/`
- PM2 logs: `~/.pm2/logs/`
- Nginx logs: `/var/log/nginx/`
- System logs: `/var/log/syslog`

## 📞 **Support**

For production support:
- Monitor application logs
- Set up alerts for critical errors
- Regular health checks
- Performance monitoring

This setup provides a robust, scalable, and secure production environment for your ShopDaraz Hub e-commerce platform.
