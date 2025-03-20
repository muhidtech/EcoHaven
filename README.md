# EcoHaven - Sustainable E-Commerce Platform

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 📋 Table of Contents

- [Overview](#overview)
- [Application Architecture](#application-architecture)
- [Component Overview](#component-overview)
- [Getting Started](#getting-started)
- [Testing Guide](#testing-guide)
- [Admin Access](#admin-access)
- [Dependencies](#dependencies)
- [Styling](#styling)
- [Development Guidelines](#development-guidelines)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## 🌿 Overview

EcoHaven is a modern e-commerce platform focused on sustainable and eco-friendly products. The application is built using Next.js and features a responsive design with TailwindCSS for styling.

## 🏗️ Application Architecture

The EcoHaven application follows the Next.js App Router structure:

```
ecohaven/
├── app/                  # Main application directory
│   ├── layout.tsx        # Root layout component
│   ├── page.tsx          # Home page component
│   ├── globals.css       # Global styles
│   ├── shop/             # Shop page
│   ├── product/[id]/     # Product details page
│   ├── cart/             # Shopping cart page
│   ├── checkout/         # Checkout process pages
│   ├── auth/             # Authentication pages
│   └── admin/            # Admin dashboard pages
├── components/           # Reusable UI components
│   ├── NavBar/           # Navigation components
│   ├── Footer/           # Footer components
│   ├── Hero/             # Hero section components
│   ├── Features/         # Features section components
│   ├── PopularProducts/  # Popular products components
│   ├── DailySells/       # Daily sales components
│   ├── Rating/           # Rating components
│   ├── Cart/             # Cart-related components
│   ├── Checkout/         # Checkout-related components
│   └── Auth/             # Authentication components
├── public/               # Static assets
│   └── images/           # Image assets
├── styles/               # Additional styles
│   └── homes.css         # Custom CSS for home page
├── lib/                  # Utility functions and helpers
├── context/              # React context providers
└── ...                   # Configuration files
```

## 🧩 Component Overview

### NavBar
The navigation bar provides easy access to different sections of the application, including:
- Logo and brand identity
- Main navigation links
- Search functionality
- User account access
- Shopping cart

### Hero
The hero section is the main banner area that:
- Showcases featured products or promotions
- Includes compelling call-to-action buttons
- Sets the visual tone for the brand
- Provides immediate engagement for visitors

### Features
The features section highlights:
- Key benefits of shopping at EcoHaven
- Sustainable practices
- Eco-friendly product guarantees
- Special services offered

### PopularProducts
This section displays:
- Best-selling products
- Product images and brief descriptions
- Pricing information
- Rating indicators
- Quick "Add to Cart" functionality

### DailySells
The daily sells component includes:
- Limited-time offers
- Special discounts
- Countdown timers for flash sales
- Featured promotional products

### Rating
The rating component provides:
- Star-based rating system
- Customer review snippets
- Overall product satisfaction metrics
- Social proof elements

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or later
- npm, yarn, pnpm, or bun package manager

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ecohaven.git
   cd ecohaven
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🧪 Testing Guide

### Core Functionality Testing

Follow these steps to thoroughly test all major functionalities of the EcoHaven platform:

#### 1. Home Page
- Verify all sections load correctly (Hero, Features, Popular Products, Daily Sells)
- Check that all navigation links work properly
- Ensure responsive design works on different screen sizes
- Verify that product images and information display correctly

#### 2. Shop Page
- Navigate to the shop page via the navigation bar
- Test filtering and sorting functionality
- Verify that product cards display correct information (image, title, price, rating)
- Test pagination if implemented
- Ensure responsive layout on different screen sizes

#### 3. Product Details
- Click on any product to view its details page
- Verify all product information is displayed correctly (images, description, price, ratings)
- Test the quantity selector
- Test the "Add to Cart" button functionality
- Verify related products section if available

#### 4. Cart Operations
- Add multiple products to the cart
- Navigate to the cart page
- Test increasing/decreasing product quantities
- Test removing items from the cart
- Verify that cart totals update correctly
- Test the "Continue Shopping" button
- Test the "Proceed to Checkout" button

#### 5. Checkout Process
- Proceed from cart to checkout
- Test the shipping information form (validation, error messages)
- Test the billing information form
- Verify shipping method selection if available
- Test payment method selection
- Verify order summary displays correct items and totals
- Test the "Place Order" functionality
- Verify order confirmation page displays after successful checkout

#### 6. User Authentication
- Test user registration with valid and invalid inputs
- Test login functionality with correct and incorrect credentials
- Test password reset functionality if available
- Verify that user profile information can be viewed and edited
- Test logout functionality
- Verify that authenticated areas are properly secured

#### 7. Cross-Browser and Responsive Testing
- Test all functionalities across different browsers (Chrome, Firefox, Safari, Edge)
- Test on different devices (desktop, tablet, mobile)
- Verify that responsive design adapts correctly to different screen sizes

## 👑 Admin Access

To access the admin dashboard and test administrative functions:

1. Navigate to the login page
2. Enter the following credentials:
   - Username: `admin`
   - Password: `admin`
3. After successful login, you will be redirected to the admin dashboard

### Admin Dashboard Testing
- Verify product management (add, edit, delete products)
- Test order management (view, update status, cancel orders)
- Verify user management if available
- Test inventory management functionality
- Verify that admin-only actions are properly secured

## 📦 Dependencies

The EcoHaven project relies on the following key dependencies:

- **Next.js**: React framework for production
- **React**: JavaScript library for building user interfaces
- **TailwindCSS**: Utility-first CSS framework
- **next/font**: For optimized font loading (Geist)
- **TypeScript**: For type safety and better developer experience

For a complete list of dependencies, refer to the `package.json` file.

## 🎨 Styling

EcoHaven uses a combination of:

### TailwindCSS
- Utility-first approach for rapid UI development
- Responsive design utilities
- Custom theme configuration in `tailwind.config.js`

### Custom CSS
- Additional custom styles in `styles/homes.css`
- Component-specific styling
- Custom animations and transitions

To modify the styling:
1. For TailwindCSS customizations, edit the `tailwind.config.js` file
2. For custom styles, modify the `styles/homes.css` file
3. Use Tailwind's `@apply` directive to create reusable custom classes

## 💻 Development Guidelines

### Code Structure
- Keep components small and focused on a single responsibility
- Use TypeScript for type safety
- Follow the file naming conventions established in the project

### State Management
- Use React hooks for local state management
- For more complex state, consider context API or state management libraries

### Adding New Features
1. Create new components in the appropriate directory
2. Update the relevant parent components to include your new feature
3. Add any necessary styles using TailwindCSS or custom CSS
4. Test thoroughly across different screen sizes

## 🌐 Deployment

### Deployment Options

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

For alternative deployment options, check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

### Production Deployment Checklist

Before deploying to production, ensure the following:

1. **Environment Variables**
   - Set up all necessary environment variables for production
   - Ensure API keys and secrets are properly secured
   - Configure payment gateway credentials for production

2. **Build Optimization**
   - Run `npm run build` to verify the build process completes successfully
   - Check for any build warnings or errors
   - Optimize images and assets for production

3. **Performance Considerations**
   - Enable caching strategies
   - Implement CDN for static assets
   - Configure proper HTTP headers

4. **Security Measures**
   - Ensure HTTPS is enabled
   - Set up proper CSP (Content Security Policy)
   - Implement rate limiting for API routes
   - Verify authentication mechanisms are secure

5. **SEO Optimization**
   - Verify meta tags are properly set
   - Ensure robots.txt is configured correctly
   - Check that sitemap.xml is generated and accessible

6. **Monitoring and Analytics**
   - Set up error tracking (e.g., Sentry)
   - Configure analytics (e.g., Google Analytics)
   - Set up performance monitoring

### Deployment Steps with Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Connect your repository to Vercel
3. Configure your project settings
4. Deploy your application
5. Set up a custom domain if needed
6. Configure environment variables in the Vercel dashboard

---

## 🤝 Contributing

Contributions to EcoHaven are welcome! Please feel free to submit a Pull Request.

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Page Not Found Errors
- Verify that all route paths in navigation links are correct
- Check for typos in URL paths
- Ensure that dynamic routes are properly configured

#### Component Rendering Issues
- Check browser console for JavaScript errors
- Verify that all required props are being passed to components
- Check for null or undefined values in component data

#### Checkout Process Problems
- Verify that form validation is working correctly
- Check that payment processing is properly configured
- Ensure order data is being correctly submitted

#### Authentication Issues
- Clear browser cookies and try again
- Verify that authentication tokens are being properly stored
- Check server-side authentication validation

#### Styling Inconsistencies
- Verify that TailwindCSS classes are applied correctly
- Check for responsive design breakpoints
- Ensure custom CSS is not conflicting with Tailwind utilities

### Getting Help
If you encounter issues not covered in this troubleshooting guide, please:
- Check the issue tracker on GitHub
- Join our community Discord for real-time support
- Contact the development team via email at support@ecohaven.example.com

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
