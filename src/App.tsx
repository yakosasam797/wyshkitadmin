import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import OrdersPage from './pages/OrdersPage'
import DashboardPage from './pages/DashboardPage'
import PartnersPage from './pages/PartnersPage'
import ProductsPage from './pages/ProductsPage'
import DisputesPage from './pages/DisputesPage'
import PayoutsPage from './pages/PayoutsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import ContentPage from './pages/ContentPage'
import SettingsPage from './pages/SettingsPage'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/orders" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/disputes" element={<DisputesPage />} />
          <Route path="/payouts" element={<PayoutsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/content" element={<ContentPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

