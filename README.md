# E-commerce Store

A modern e-commerce application built with Next.js, Prisma, and MySQL.

## Features

- 🛍️ Complete e-commerce functionality
- 👥 Multi-role user management (Super Admin, Management, Customer)
- 📦 Product management with categories, images, and attributes
- 🛒 Shopping cart and order management
- ⭐ Product reviews and ratings
- 🔐 JWT-based authentication
- 📱 Responsive design with Tailwind CSS
- 🗄️ MySQL database with Prisma ORM

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, NextUI, Radix UI
- **Backend**: Next.js API Routes
- **Database**: MySQL with Prisma ORM
- **Authentication**: JWT with HTTP-only cookies
- **Validation**: Zod
- **Icons**: Lucide React

## Database Schema

The application includes comprehensive models for:

- **Users**: Multi-role support (Super Admin, Management, Customer)
- **Products**: Full product management with variants, images, and attributes
- **Categories**: Hierarchical category structure
- **Orders**: Complete order management with items and status tracking
- **Cart**: Shopping cart functionality
- **Reviews**: Product reviews and ratings
- **Addresses**: User address management

## Getting Started

### Prerequisites

- Node.js 18+ 
- MySQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-store
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Update the `.env` file with your database credentials:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/ecommerce_store"
   JWT_SECRET="your-super-secret-jwt-key"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   # Create and migrate the database
   npx prisma db push
   
   # Generate Prisma client
   npx prisma generate
   
   # Seed the database with sample data
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Default Credentials

After seeding the database, you can use these credentials:

### Admin Account
- **Email**: admin@ecommerce.com
- **Password**: admin123
- **Role**: Super Admin

### Customer Account
- **Email**: customer@example.com
- **Password**: customer123
- **Role**: Customer

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with pagination and filters)
- `POST /api/products` - Create new product (Admin only)

## Database Management

### Useful Prisma Commands

```bash
# View your data in Prisma Studio
npx prisma studio

# Reset the database
npx prisma db push --force-reset

# Re-seed the database
npx prisma db seed

# Generate Prisma client after schema changes
npx prisma generate
```

## Project Structure

```
ecommerce-store/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (protected)/       # Protected admin pages
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
├── lib/                   # Utility functions
│   ├── auth.ts           # Authentication utilities
│   ├── db.ts             # Database connection
│   └── middleware.ts     # Auth middleware
├── prisma/               # Database schema and migrations
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Database seeder
└── public/               # Static assets
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
