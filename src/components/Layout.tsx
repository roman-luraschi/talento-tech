import type { ReactNode } from 'react'
import '../css/Layout.css'
import Footer from './Footer'
import Header from './Header'

interface LayoutProps {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <Header />
      <main className="layout__main">{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
