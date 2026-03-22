# Restaurant Menu Application - React Frontend

A mobile-first React application for displaying restaurant menus with real-time data fetching.

## 📋 Features

- ✅ Dynamic routing with `react-router-dom` for capturing `rest_id` and `table_id`
- ✅ Server state management using `@tanstack/react-query`
- ✅ Mobile-first responsive design with Tailwind CSS
- ✅ Category filtering for menu items
- ✅ Add to cart functionality (quantity controls)
- ✅ Loading and error states
- ✅ Clean, modern UI with smooth animations

## 🚀 Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Access the Application**
   Navigate to: `http://localhost:3000/69a804d828d7bda3814eb3ab/table_1`
   
   Replace `69a804d828d7bda3814eb3ab` with your restaurant ID and `table_1` with your table ID.

## 📁 Project Structure

```
src/
├── components/
│   ├── ErrorMessage.js      # Error display component
│   ├── LoadingSpinner.js    # Loading state component
│   ├── MenuItem.js          # Individual menu item card
│   └── MenuList.js          # Menu items grid with filtering
├── pages/
│   └── MenuPage.js          # Main page with data fetching
├── App.js                   # Main app with routing
├── index.js                 # React entry point
└── index.css               # Tailwind CSS directives
```

## 🔌 API Integration

The app expects the backend API at:
```
GET http://localhost:5000/api/menus?rest_id={rest_id}&table_id={table_id}
```

### Expected Response Format
```json
[
  {
    "id": "1",
    "name": "Burger",
    "description": "Delicious beef burger",
    "price": 12.99,
    "category": "Main",
    "image": "https://...",
    "rating": 4.5
  }
]
```

## 📱 Mobile-First Design

- Fully responsive layout optimized for mobile devices
- Touch-friendly buttons and controls
- Efficient use of screen space with scrollable category filters
- Grid layout that adapts from 1 column on mobile to 2 on desktop

## 🎨 Tailwind Configuration

Tailwind CSS is configured in `tailwind.config.js` and includes:
- Custom colors (orange theme for primary actions)
- Mobile-first breakpoints
- Responsive utilities

## 🔧 Key Technologies

- **React 18** - UI library
- **React Router DOM v7** - Client-side routing
- **TanStack Query (React Query)** - Server state management
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework

## 📝 Next Steps

1. **Connect to your backend** - Update the API endpoint in `src/pages/MenuPage.js`
2. **Implement cart functionality** - Add cart context/state management
3. **Add order submission** - Create order review and checkout pages
4. **Customize theme** - Adjust Tailwind colors in `tailwind.config.js`
5. **Add item details page** - Create detailed view for menu items

## 🐛 Troubleshooting

If the app doesn't load:
1. Ensure backend is running on `http://localhost:5000`
2. Check browser console for CORS errors
3. Verify `rest_id` and `table_id` are valid values
4. Ensure the API response matches the expected format

