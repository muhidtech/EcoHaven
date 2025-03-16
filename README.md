# EcoHaven - Sustainable E-Commerce Platform

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 📋 Table of Contents

- [Overview](#overview)
- [Application Architecture](#application-architecture)
- [Component Overview](#component-overview)
- [Getting Started](#getting-started)
- [Dependencies](#dependencies)
- [Styling](#styling)
- [Development Guidelines](#development-guidelines)
- [Deployment](#deployment)

## 🌿 Overview

EcoHaven is a modern e-commerce platform focused on sustainable and eco-friendly products. The application is built using Next.js and features a responsive design with TailwindCSS for styling.

## 🏗️ Application Architecture

The EcoHaven application follows the Next.js App Router structure:

```
ecohaven/
├── app/                  # Main application directory
│   ├── layout.tsx        # Root layout component
│   ├── page.tsx          # Home page component
│   └── globals.css       # Global styles
├── components/           # Reusable UI components
│   ├── NavBar/           # Navigation components
│   ├── Hero/             # Hero section components
│   ├── Features/         # Features section components
│   ├── PopularProducts/  # Popular products components
│   ├── DailySells/       # Daily sales components
│   └── Rating/           # Rating components
├── public/               # Static assets
│   └── images/           # Image assets
├── styles/               # Additional styles
│   └── homes.css         # Custom CSS for home page
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

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

For alternative deployment options, check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

---

## 🤝 Contributing

Contributions to EcoHaven are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
