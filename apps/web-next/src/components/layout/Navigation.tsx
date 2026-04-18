'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on route change
  useEffect(() => {
    setTimeout(() => {
      setIsOpen(false);
    }, 0);
  }, [pathname]);

  // Handle body scroll locking
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isOpen]);

  return (
    <>
      <button 
        className={`menu-toggle ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(true)}
        aria-label="Open Menu"
        aria-expanded={isOpen}
      >
        <div className="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      <div 
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <aside className={`sidebar ${isOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <span className="sidebar-title">Menu</span>
          <button 
            className="close-btn" 
            onClick={() => setIsOpen(false)}
            aria-label="Close Menu"
          >
            &times;
          </button>
        </div>

        <ul className="nav-links">
          <li><Link href="/">Beranda</Link></li>
          <li><Link href="/produk">Produk</Link></li>
          <li><Link href="/harga-sewa-kasur">Harga Sewa</Link></li>
          <li><Link href="/#calculator">Hitung Biaya</Link></li>
          <li><Link href="/artikel">Artikel & Tips</Link></li>
          <li><Link href="/about">Tentang Kami</Link></li>
          <li><Link href="/#service-area">Area Layanan</Link></li>
          <li>
            <a
              href="https://wa.me/6289519119092"
              className="nav-whatsapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hubungi WhatsApp
            </a>
          </li>
        </ul>
      </aside>

      <style jsx>{`
        .menu-toggle {
          background: none;
          border: none;
          cursor: pointer;
          padding: var(--space-2);
          display: block;
          z-index: 1001;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }

        .hamburger {
          width: 24px;
          height: 18px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .hamburger span {
          display: block;
          height: 3px;
          width: 100%;
          background-color: var(--color-primary);
          border-radius: 3px;
          transition: all 0.3s ease;
        }

        /* Active state animation for hamburger (optional nice touch) */
        .menu-toggle.active .hamburger span:nth-child(1) {
          transform: translateY(7.5px) rotate(45deg);
        }
        .menu-toggle.active .hamburger span:nth-child(2) {
          opacity: 0;
        }
        .menu-toggle.active .hamburger span:nth-child(3) {
          transform: translateY(-7.5px) rotate(-45deg);
        }

        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          z-index: 1000;
        }

        .sidebar-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        .sidebar {
          position: fixed;
          top: 0;
          left: -300px;
          width: 280px;
          height: 100vh;
          background-color: var(--color-surface, #ffffff);
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
          transition: left 0.3s ease;
          z-index: 1002;
          padding: var(--space-6);
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        .sidebar.active {
          left: 0;
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-8);
        }

        .sidebar-title {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
          color: var(--color-primary);
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 2rem;
          line-height: 1;
          cursor: pointer;
          color: var(--color-text-secondary);
        }

        .nav-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .nav-links li {
          margin-bottom: var(--space-4);
        }

        .nav-links a {
          text-decoration: none;
          color: var(--color-text);
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-medium);
          transition: color 0.2s;
          display: block;
          padding: var(--space-2) 0;
        }

        .nav-links a:hover {
          color: var(--color-primary);
        }

        .nav-whatsapp {
          margin-top: var(--space-4);
          background: var(--color-primary);
          color: white !important;
          text-align: center;
          padding: var(--space-3) !important;
          border-radius: var(--radius-md);
        }
      `}</style>
    </>
  );
}
