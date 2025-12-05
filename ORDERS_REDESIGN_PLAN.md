# Orders Module Redesign - Implementation Plan

## Current Progress ✅

### Components Created:
1. ✅ `PriorityTag.tsx` - Priority badges (Preview Overdue, Delivery Delay, etc.)
2. ✅ `PreviewState.tsx` - Preview workflow visibility with versions and countdown
3. ✅ `VendorPerformanceBadge.tsx` - Vendor metrics display
4. ✅ `InlineOrderActions.tsx` - Contextual action buttons for table rows
5. ✅ `RiskFilterPresets.tsx` - 1-click filter chips
6. ✅ `priorityCalculations.ts` - Priority level calculation utilities
7. ✅ `RiskRadar.tsx` - Already exists (3-card risk dashboard)

### Data Model:
- ✅ Extended TypeScript types with all required fields
- ✅ Added PayoutState, RTStatus, PreviewVersion, VendorMetrics, CourierInfo

## Implementation Tasks Remaining

### Phase 1: Redesign Orders Table Structure ⏳
- Update table columns to new structure:
  - Alert Level (priority tags)
  - Product + Vendor (with vendor performance badge)
  - Customer Name
  - SLA Timer
  - Status
  - Preview State
  - Quick Actions (inline buttons)
- Integrate priority heat system (red/yellow/white rows)
- Add Fresh Perishable badges

### Phase 2: Priority Heat System ⏳
- Apply calculateOrderPriority() to all orders
- Style rows with background colors based on priority
- Add priority tags to each row
- Ensure Fresh orders sorted to top

### Phase 3: Integrate New Components ⏳
- Replace current table columns with new structure
- Add PreviewState component to table
- Add VendorPerformanceBadge to vendor column
- Replace AdminActionMenu with InlineOrderActions
- Add PriorityTag components

### Phase 4: Risk Filter Presets ⏳
- Add RiskFilterPresets component above table
- Implement filter logic for presets
- Connect to existing filter system

### Phase 5: Enhanced Filtering ⏳
- Add risk-based filter presets logic
- Update sorting to "highest operational damage first"
- Ensure Fresh orders always prioritized

### Phase 6: Styling & Polish ⏳
- Update CSS for priority heat system
- Style new table columns
- Ensure responsive design
- Add animations for state changes

## Files to Modify

1. `src/pages/OrdersPage.tsx` - Complete redesign
2. `src/pages/OrdersPage.css` - Heat system styling
3. `src/data/mockOrders.ts` - Add new fields to mock data

## Next Steps

Ready to proceed with comprehensive redesign implementation.

