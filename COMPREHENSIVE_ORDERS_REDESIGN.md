# Comprehensive Orders Module Redesign - Implementation Plan

## Overview
Transform the Orders module from a monitoring tool into an action-oriented, priority-driven intervention system based on the detailed UX/UI specifications.

## Current Status

### ✅ Components Created:
1. Priority Calculation System (`src/utils/priorityCalculations.ts`)
2. PriorityTag Component (Preview Overdue, Delivery Delay, etc.)
3. PreviewState Component (Version tags, countdown, waiting party)
4. VendorPerformanceBadge Component (Rating, SLA%, Refund Risk)
5. InlineOrderActions Component (Contextual action buttons)
6. RiskFilterPresets Component (1-click filter chips)
7. RiskRadar Component (3-card dashboard)

### ✅ Data Model Extended:
- PayoutState types
- PreviewVersion interface
- VendorMetrics interface
- CourierInfo interface
- All required order fields

## Implementation Plan

### Phase 1: Integrate Priority Heat System
- Import and use `calculateOrderPriority()` utility
- Calculate priority for each order (critical/at-risk/healthy)
- Apply heat-based row styling (red/yellow/white)
- Update priority score calculation to use new system

### Phase 2: Redesign Table Structure
New column structure:
- Alert Level (Priority tags)
- Product + Vendor (with performance badge)
- Customer Name
- Order Type (Regular/Packaged/Fresh with tags)
- SLA Timer
- Status
- Preview State
- Quick Actions

### Phase 3: Integrate All New Components
- Replace table columns with new components
- Add PriorityTag to Alert Level column
- Add VendorPerformanceBadge to vendor display
- Add PreviewState component
- Replace AdminActionMenu with InlineOrderActions
- Add Fresh Perishable badges

### Phase 4: Add Risk Filter Presets
- Add RiskFilterPresets component above table
- Calculate counts for each preset
- Implement filter logic
- Connect to existing filter system

### Phase 5: Enhanced Sorting & Filtering
- Update default sort: "Highest operational damage first"
- Ensure Fresh orders always prioritized
- Integrate risk filter presets with existing filters

### Phase 6: Update Styling
- Priority heat system CSS (red/yellow/white backgrounds)
- New column styling
- Responsive design updates
- Animations for state changes

## Files to Modify

1. `src/pages/OrdersPage.tsx` - Complete redesign
2. `src/pages/OrdersPage.css` - Heat system and new column styles
3. `src/data/mockOrders.ts` - Add new fields for testing

## Success Criteria

✅ Orders sorted by priority (highest operational damage first)
✅ Heat-based row colors (Red/Yellow/White)
✅ Inline actions visible in table
✅ Preview workflow clearly visible
✅ Vendor metrics displayed
✅ Risk filter presets working
✅ Fresh orders prioritized

