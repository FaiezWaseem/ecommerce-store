import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await hashPassword('admin123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ecommerce.com' },
    update: {},
    create: {
      email: 'admin@ecommerce.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create sample customer
  const customerPassword = await hashPassword('customer123');
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      password: customerPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'CUSTOMER',
      isActive: true,
    },
  });
  console.log('✅ Customer user created:', customer.email);

  // Create categories
  const electronics = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronic devices and gadgets',
      isActive: true,
    },
  });

  const smartphones = await prisma.category.upsert({
    where: { slug: 'smartphones' },
    update: {},
    create: {
      name: 'Smartphones',
      slug: 'smartphones',
      description: 'Mobile phones and accessories',
      parentId: electronics.id,
      isActive: true,
    },
  });

  const laptops = await prisma.category.upsert({
    where: { slug: 'laptops' },
    update: {},
    create: {
      name: 'Laptops',
      slug: 'laptops',
      description: 'Portable computers and accessories',
      parentId: electronics.id,
      isActive: true,
    },
  });

  const clothing = await prisma.category.upsert({
    where: { slug: 'clothing' },
    update: {},
    create: {
      name: 'Clothing',
      slug: 'clothing',
      description: 'Fashion and apparel',
      isActive: true,
    },
  });

  console.log('✅ Categories created');

  // Create sample products
  const products = [
    {
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      description: 'Latest iPhone with advanced features and powerful performance.',
      shortDescription: 'Premium smartphone with Pro camera system.',
      sku: 'IPHONE15PRO',
      regularPrice: 999.99,
      salePrice: 899.99,
      categoryId: smartphones.id,
      status: 'ACTIVE' as const,
      stockStatus: 'IN_STOCK' as const,
      stockQuantity: 50,
      manageStock: true,
      isFeatured: true,
      weight: 0.221,
    },
    {
      name: 'MacBook Pro 16"',
      slug: 'macbook-pro-16',
      description: 'Powerful laptop for professionals with M3 chip and stunning display.',
      shortDescription: 'Professional laptop with M3 chip.',
      sku: 'MBP16M3',
      regularPrice: 2499.99,
      categoryId: laptops.id,
      status: 'ACTIVE' as const,
      stockStatus: 'IN_STOCK' as const,
      stockQuantity: 25,
      manageStock: true,
      isFeatured: true,
      weight: 2.1,
    },
    {
      name: 'Samsung Galaxy S24',
      slug: 'samsung-galaxy-s24',
      description: 'Android smartphone with excellent camera and display.',
      shortDescription: 'Premium Android smartphone.',
      sku: 'GALAXYS24',
      regularPrice: 799.99,
      salePrice: 749.99,
      categoryId: smartphones.id,
      status: 'ACTIVE' as const,
      stockStatus: 'IN_STOCK' as const,
      stockQuantity: 75,
      manageStock: true,
      weight: 0.196,
    },
    {
      name: 'Classic T-Shirt',
      slug: 'classic-t-shirt',
      description: 'Comfortable cotton t-shirt in various colors.',
      shortDescription: '100% cotton comfortable t-shirt.',
      sku: 'TSHIRT001',
      regularPrice: 29.99,
      salePrice: 24.99,
      categoryId: clothing.id,
      status: 'ACTIVE' as const,
      stockStatus: 'IN_STOCK' as const,
      stockQuantity: 200,
      manageStock: true,
      weight: 0.15,
    },
    {
      name: 'Dell XPS 13',
      slug: 'dell-xps-13',
      description: 'Compact and powerful ultrabook for everyday use.',
      shortDescription: 'Ultrabook with premium design.',
      sku: 'DELLXPS13',
      regularPrice: 1299.99,
      categoryId: laptops.id,
      status: 'ACTIVE' as const,
      stockStatus: 'IN_STOCK' as const,
      stockQuantity: 30,
      manageStock: true,
      weight: 1.27,
    },
  ];

  for (const productData of products) {
    await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: productData,
    });
  }

  console.log('✅ Sample products created');

  // Create sample product images
  const iphoneProduct = await prisma.product.findUnique({
    where: { slug: 'iphone-15-pro' },
  });

  if (iphoneProduct) {
    await prisma.productImage.upsert({
      where: { id: 'iphone-main-image' },
      update: {},
      create: {
        id: 'iphone-main-image',
        productId: iphoneProduct.id,
        url: '/placeholder.svg',
        alt: 'iPhone 15 Pro',
        isMain: true,
        sortOrder: 0,
      },
    });
  }

  console.log('✅ Sample product images created');

  // Create more categories
  const womensFashion = await prisma.category.upsert({
    where: { slug: 'womens-fashion' },
    update: {},
    create: {
      name: "Women's Fashion",
      slug: 'womens-fashion',
      description: 'Fashion and clothing for women',
      isActive: true,
    },
  });

  const mensFashion = await prisma.category.upsert({
    where: { slug: 'mens-fashion' },
    update: {},
    create: {
      name: "Men's Fashion",
      slug: 'mens-fashion',
      description: 'Fashion and clothing for men',
      isActive: true,
    },
  });

  const homeLifestyle = await prisma.category.upsert({
    where: { slug: 'home-lifestyle' },
    update: {},
    create: {
      name: 'Home & Lifestyle',
      slug: 'home-lifestyle',
      description: 'Home decor and lifestyle products',
      isActive: true,
    },
  });

  const medicine = await prisma.category.upsert({
    where: { slug: 'medicine' },
    update: {},
    create: {
      name: 'Medicine',
      slug: 'medicine',
      description: 'Health and medical products',
      isActive: true,
    },
  });

  const sportsOutdoor = await prisma.category.upsert({
    where: { slug: 'sports-outdoor' },
    update: {},
    create: {
      name: 'Sports & Outdoor',
      slug: 'sports-outdoor',
      description: 'Sports equipment and outdoor gear',
      isActive: true,
    },
  });

  const babysToys = await prisma.category.upsert({
    where: { slug: 'babys-toys' },
    update: {},
    create: {
      name: "Baby's & Toys",
      slug: 'babys-toys',
      description: 'Baby products and toys',
      isActive: true,
    },
  });

  const groceriesPets = await prisma.category.upsert({
    where: { slug: 'groceries-pets' },
    update: {},
    create: {
      name: 'Groceries & Pets',
      slug: 'groceries-pets',
      description: 'Groceries and pet supplies',
      isActive: true,
    },
  });

  const healthBeauty = await prisma.category.upsert({
    where: { slug: 'health-beauty' },
    update: {},
    create: {
      name: 'Health & Beauty',
      slug: 'health-beauty',
      description: 'Health and beauty products',
      isActive: true,
    },
  });

  console.log('✅ Additional categories created');

  // Create Home Page Settings
  await prisma.homePageSettings.upsert({
    where: { id: 'default-settings' },
    update: {},
    create: {
      id: 'default-settings',
      topBannerEnabled: true,
      topBannerText: 'Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!',
      topBannerLink: '/products',
      topBannerLinkText: 'ShopNow',
      heroSectionEnabled: true,
      categoriesEnabled: true,
      flashSaleEnabled: true,
      bestSellingEnabled: true,
      featuredBannerEnabled: true,
      exploreProductsEnabled: true,
      newArrivalEnabled: true,
      servicesEnabled: true,
    },
  });

  console.log('✅ Home page settings created');

  // Create Carousel Banners
  const carouselBanners = [
    {
      title: 'iPhone 14 Series',
      subtitle: 'Up to 10% off Voucher',
      buttonText: 'Shop Now',
      buttonLink: '/category/smartphones',
      image: '/placeholder.svg',
      isActive: true,
      sortOrder: 1,
    },
    {
      title: 'Summer Collection',
      subtitle: 'New Arrivals 2024',
      buttonText: 'Explore',
      buttonLink: '/category/clothing',
      image: '/placeholder.svg',
      isActive: true,
      sortOrder: 2,
    },
    {
      title: 'Gaming Laptops',
      subtitle: 'Performance Unleashed',
      buttonText: 'View Products',
      buttonLink: '/category/laptops',
      image: '/placeholder.svg',
      isActive: true,
      sortOrder: 3,
    },
  ];

  for (const banner of carouselBanners) {
    await prisma.carouselBanner.create({ data: banner });
  }

  console.log('✅ Carousel banners created');

  // Create Promotional Banners
  const promotionalBanners = [
    {
      title: 'Categories',
      description: 'Browse Our Range',
      image: '/placeholder.svg',
      link: '/categories',
      isActive: true,
      sortOrder: 1,
    },
    {
      title: 'New Arrivals',
      description: 'Fresh Products',
      image: '/placeholder.svg',
      link: '/products?filter=new',
      isActive: true,
      sortOrder: 2,
    },
  ];

  for (const banner of promotionalBanners) {
    await prisma.promotionalBanner.create({ data: banner });
  }

  console.log('✅ Promotional banners created');

  // Create Featured Sections
  const featuredSections = [
    {
      title: 'Enhance Your Music Experience',
      subtitle: 'Premium Audio Equipment',
      description: 'Discover our range of high-quality audio products',
      buttonText: 'Buy Now!',
      buttonLink: '/category/electronics',
      image: '/placeholder.svg',
      bgColor: '#000000',
      textColor: '#ffffff',
      type: 'MUSIC' as const,
      isActive: true,
      sortOrder: 1,
    },
    {
      title: 'Gaming Zone',
      subtitle: 'Level Up Your Game',
      description: 'Professional gaming equipment and accessories',
      buttonText: 'Explore',
      buttonLink: '/category/electronics',
      image: '/placeholder.svg',
      bgColor: '#1a1a1a',
      textColor: '#ffffff',
      type: 'GAMING' as const,
      isActive: true,
      sortOrder: 2,
    },
  ];

  for (const section of featuredSections) {
    await prisma.featuredSection.create({ data: section });
  }

  console.log('✅ Featured sections created');

  // Create Headline Messages
  const headlineMessages = [
    {
      message: 'Free and fast delivery - Free delivery for all orders over $140',
      type: 'INFO' as const,
      isActive: true,
    },
    {
      message: '24/7 Customer Service - Friendly 24/7 customer support',
      type: 'INFO' as const,
      isActive: true,
    },
    {
      message: 'Money Back Guarantee - We return money within 30 days',
      type: 'SUCCESS' as const,
      isActive: true,
    },
  ];

  for (const messageData of headlineMessages) {
    await prisma.headlineMessage.create({ data: messageData });
  }

  console.log('✅ Headline messages created');

  // Create Sale Banners
  const saleBanners = [
    {
      title: 'Flash Sale',
      description: 'Limited time offers on selected items',
      discount: '50%',
      image: '/placeholder.svg',
      bgColor: '#ff0000',
      textColor: '#ffffff',
      buttonText: 'Shop Now',
      buttonLink: '/products?sale=true',
      isActive: true,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
    {
      title: 'Weekend Special',
      description: 'Extra savings this weekend only',
      discount: '30%',
      image: '/placeholder.svg',
      bgColor: '#00aa00',
      textColor: '#ffffff',
      buttonText: 'Get Deal',
      buttonLink: '/products?weekend=true',
      isActive: true,
      startDate: new Date(),
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    },
  ];

  for (const banner of saleBanners) {
    await prisma.saleBanner.create({ data: banner });
  }

  console.log('✅ Sale banners created');

  console.log('🎉 Database seeding completed!');
  console.log('\n📧 Admin credentials:');
  console.log('Email: admin@ecommerce.com');
  console.log('Password: admin123');
  console.log('\n📧 Customer credentials:');
  console.log('Email: customer@example.com');
  console.log('Password: customer123');
  console.log('\n🌐 You can now access:');
  console.log(`- Home page with dynamic content: ${process.env.NEXT_PUBLIC_APP_URL}`);
  console.log(`- Admin panel: ${process.env.NEXT_PUBLIC_APP_URL}/admin`);
  console.log(`- Home settings: ${process.env.NEXT_PUBLIC_APP_URL}/admin/home-settings`);
  console.log('- Prisma Studio: http://localhost:5555');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });