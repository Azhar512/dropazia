# ShopDaraz Hub

A modern B2B e-commerce management platform for sellers managing products across **Daraz** and **Shopify** marketplaces.

## 🚀 Features

- **Multi-Module Support**: Manage products for both Daraz and Shopify
- **User Management**: Role-based access (buyer, seller, admin) with approval system
- **Product Management**: Complete CRUD operations with images and documents
- **Shopping Cart**: Persistent cart with database storage
- **Payment Gateway**: Integrated PayFast for secure online payments (Cards, EFT, etc.)
- **Order Processing**: Full order lifecycle management
- **Analytics & Profits**: Track sales and profits per module
- **Returns Management**: Handle product returns and refunds
- **Wishlist**: Save products for later
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** + **shadcn/ui** components
- **React Router** for navigation
- **React Query** for data fetching
- **React Hook Form** + **Zod** for validation

### Backend
- **Node.js** + **Express**
- **Supabase PostgreSQL** database
- **JWT** authentication
- **bcryptjs** for password hashing
- Security middleware (Helmet, CORS, rate limiting)

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account (for database)
- Git

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd shopdaraz-hub-main
```

### 2. Install dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Environment Setup

#### Backend Environment (`backend/.env`)

```env
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
NODE_ENV=production
PORT=5000
FRONTEND_URL=http://localhost:3000
```

#### Frontend Environment (`.env` in root)

```env
VITE_API_URL=http://localhost:5000
```

**See [ENV_SETUP.md](./ENV_SETUP.md) for detailed environment variable setup.**

### 4. Database Setup

1. Create a Supabase project
2. Run the SQL schema from `backend/database/supabase-schema.sql` in Supabase SQL Editor
3. Update `DATABASE_URL` in `backend/.env` with your Supabase connection string

### 5. Create Admin User

```bash
cd backend
npm run create-admin
```

This creates an admin user:
- **Email**: `admin@shopdaraz.com`
- **Password**: `admin123`

⚠️ **Change the password immediately after first login!**

### 6. Start Development Servers

#### Backend (Terminal 1)
```bash
cd backend
npm run dev
```

#### Frontend (Terminal 2)
```bash
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000 (or Vite's default port)
- **Backend API**: http://localhost:5000

## 📁 Project Structure

```
shopdaraz-hub-main/
├── backend/              # Backend API
│   ├── src/
│   │   ├── config/       # Database configuration
│   │   ├── controllers/  # API controllers
│   │   ├── models/       # Database models (PostgreSQL)
│   │   ├── routes/       # Express routes
│   │   └── middleware/   # Auth middleware
│   └── database/         # SQL schemas
├── src/                  # Frontend React app
│   ├── components/       # React components
│   ├── contexts/         # React contexts
│   ├── pages/            # Page components
│   ├── services/         # API service layer
│   └── types/            # TypeScript types
└── public/               # Static assets
```

## 🔧 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `npm run dev` - Start development server (nodemon)
- `npm start` - Start production server
- `npm run create-admin` - Create admin user
- `npm run check-db` - Check database status

## 🔐 Security

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for allowed origins
- **Helmet**: Security headers
- **Environment Variables**: All secrets in `.env` files

## 📚 Documentation

- **[ENV_SETUP.md](./ENV_SETUP.md)** - Environment variables setup
- **[PAYFAST_SETUP_GUIDE.md](./PAYFAST_SETUP_GUIDE.md)** - PayFast payment gateway integration guide
- **[PROJECT_CLEANUP_SUMMARY.md](./PROJECT_CLEANUP_SUMMARY.md)** - Recent migration and cleanup details
- **[SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)** - Detailed setup guide
- **[LOCAL_SETUP.md](./LOCAL_SETUP.md)** - Local development setup

## 🚢 Deployment

### Backend (Vercel)
- Deploys automatically from GitHub
- Configure environment variables in Vercel dashboard
- Set `FRONTEND_URL` to your production domain

### Frontend (Hostinger/Vercel)
- Build with `npm run build`
- Upload `dist/` folder contents
- Configure `.env` with production API URL

**See deployment-specific guides in the repository for detailed instructions.**

## 🐛 Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` in `backend/.env`
- Check Supabase project is active
- Ensure connection string uses correct credentials

### Authentication Issues
- Verify `JWT_SECRET` is set in `backend/.env`
- Check token expiration
- Clear browser cache/localStorage

### CORS Errors
- Update `FRONTEND_URL` in `backend/.env`
- Include all variants (with/without www)
- Restart backend server after changes

## 📝 License

[Your License Here]

## 🤝 Contributing

[Your Contributing Guidelines Here]

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ using modern web technologies**
