import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Box, 
  DollarSign, 
  FileText, 
  Settings, 
  Sun, 
  Bell, 
  User,
  ShoppingCart
} from 'lucide-react'
import './Layout.css'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: null },
    { path: '/partners', icon: Users, label: 'Partners', badge: 18 },
    { path: '/products', icon: Package, label: 'Products', badge: 12 },
    { path: '/orders', icon: Box, label: 'Orders', badge: null },
    { path: '/payouts', icon: DollarSign, label: '$ Payouts', badge: 120 },
    { path: '/content', icon: FileText, label: 'Content', badge: null },
    { path: '/settings', icon: Settings, label: 'Settings', badge: null },
  ]

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-left">
          <div className="logo">
            <ShoppingCart className="logo-icon" />
            <span className="logo-text">WYSHKIT</span>
            <span className="logo-admin">ADMIN</span>
          </div>
          <div className="nav-links">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  <Icon className="nav-icon" />
                  <span>{item.label}</span>
                  {item.badge !== null && (
                    <span className="nav-badge">{item.badge}</span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
        <div className="navbar-right">
          <button className="icon-button">
            <Sun className="icon" />
          </button>
          <button className="icon-button badge-button">
            <Bell className="icon" />
            <span className="badge">3</span>
          </button>
          <button className="icon-button">
            <User className="icon" />
          </button>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}


