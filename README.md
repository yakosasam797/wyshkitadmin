# WYSHKIT Admin Panel

Admin panel for Wyshkit gifting marketplace platform.

## Features

### Orders Tab (Fully Functional)
- **Live Order Feed**: Real-time order monitoring with automatic status updates
- **Order Filtering**: Filter by status, product type, and search functionality
- **Order Details**: Comprehensive order information including:
  - Customer details
  - Product information with customization status
  - Vendor information
  - Delivery address
  - Package details (weight, dimensions)
  - Tracking information
  - Preview approval status with SLA tracking
- **Status Management**: Visual status indicators for all order stages
- **Real-time Updates**: Simulated live updates every 5 seconds

### Other Tabs (Skeleton)
- Dashboard
- Partners
- Products
- Disputes
- Payouts
- Analytics
- Content
- Settings

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- Lucide React (Icons)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Order Status Flow

1. **Order Placed** → Order created and assigned to vendor
2. **Customizing** → Vendor uploading preview (if applicable)
3. **Awaiting Approval** → Customer approval pending (24h SLA for regular, 1-2h for fresh)
4. **Preparing** → Vendor producing customization
5. **Packed** → Product packed with weight/dimensions
6. **Ready for Pickup** → Awaiting pickup by delivery partner
7. **Out for Delivery** → In transit to customer
8. **Delivered** → Order completed

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── Layout.tsx   # Main navigation layout
│   ├── OrderCard.tsx # Order display card
│   └── OrderFilters.tsx # Order filtering component
├── pages/           # Page components
│   ├── OrdersPage.tsx # Main orders page (functional)
│   └── [Other pages] # Skeleton pages
├── types/           # TypeScript types
│   └── order.ts     # Order type definitions
└── data/            # Mock data
    └── mockOrders.ts # Sample order data
```

