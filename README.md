# E-Commerce Product Listing Page

## Overview
This project is an interactive e-commerce product listing page built using **Next.js** with **ShadCN** for UI components. It dynamically fetches product data, allows filtering and sorting, and includes personalized shopping features to enhance the user experience.

## Features
### **Mandatory Features**
- **Product Listing with Image Carousel**: Displays products with an interactive image carousel.
- **Filtering & Sorting with Debounced Input**: Users can search, filter by category, sort products, and adjust the price range with a smooth debounced input.
- **'Recommended for You' Section**: A personalized recommendation section based on user interactions.
- **Wishlist Feature**: Users can add and manage products in their wishlist.
- **Pagination/Infinite Scroll**: Efficiently loads products with pagination or infinite scrolling for seamless browsing.
- **Price Range Filter**: Allows users to set a minimum and maximum price range.
- **Documentation**: Comprehensive documentation for setup, usage, and contribution.

### **Bonus Features**
- **Fully Functioning Shopping Cart**: Users can add products, adjust quantities, and see real-time total calculations.
- **Enhanced Accessibility**: Implemented keyboard navigation, ARIA attributes, and optimized color contrast.
- **Smooth Hover Animations**: Enhanced product cards with hover effects for a modern shopping experience.

## Tech Stack
- **Frontend**: [Next.js](https://nextjs.org/) (React framework)
- **UI Library**: [ShadCN](https://ui.shadcn.com/)
- **State Management**: Zustand (for global state management)
- **Debounce Handling**: use-debounce (for optimized search and filtering)
- **Styling**: Tailwind CSS

## Installation & Setup
### **Prerequisites**
Ensure you have Node.js installed (v16 or later).

### **Steps to Run the Project**
1. **Clone the Repository**
   ```bash
   git clone https://github.com/Sidharth1504/Ecommerce-page.git
   cd ecommerce-site
   ```

2. **Install Dependencies**
   ```bash
   npm install  # or yarn install
   ```

3. **Start the Development Server**
   ```bash
   npm run dev  # or yarn dev
   ```

4. **Open in Browser**
   Navigate to `http://localhost:3000` to view the product listing page.

## Usage Guide
### **Filtering & Sorting**
- Use the search bar to find specific products.
- Apply filters for category and price range.
- Sort products by price, popularity, or rating.

### **Wishlist Feature**
- Click on the heart icon to add/remove products from the wishlist.
- The wishlist persists across sessions using local storage.

### **Shopping Cart (Bonus Feature)**
- Add products to the cart with quantity controls.
- View the real-time total price and checkout.

### **Pagination & Infinite Scroll**
- Products load in pages, improving performance.
- Infinite scroll loads more products dynamically as you scroll.

## Future Improvements
- Implement user authentication for personalized recommendations.
- Improve performance with server-side rendering (SSR) and caching.
- Integrate a backend API for real-time product updates.

## Contributions
Contributions are welcome! Feel free to submit pull requests or open issues for improvements.

## License
This project is licensed under the MIT License.

---

Built with ❤️ using Next.js and ShadCN.