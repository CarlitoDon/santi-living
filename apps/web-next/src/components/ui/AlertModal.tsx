'use client';

import { useState, useEffect, useRef } from 'react';
import { usePresence } from '@/hooks/usePresence';
import { useDialogFocus } from '@/hooks/useDialogFocus';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

export function AlertModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState({ title: 'Perhatian', message: '', type: 'error' });
  const actionButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const presence = usePresence(isOpen, 240);
  useBodyScrollLock(presence.shouldRender);

  useEffect(() => {
    const handleShowAlert = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setContent({
        title: detail.title || 'Perhatian',
        message: detail.message,
        type: detail.type || 'error'
      });
      setIsOpen(true);
    };

    window.addEventListener('show-alert', handleShowAlert);
    return () => window.removeEventListener('show-alert', handleShowAlert);
  }, []);

  useDialogFocus({
    isOpen,
    onClose: () => setIsOpen(false),
    containerRef: dialogRef,
    initialFocusRef: actionButtonRef,
  });

  if (!presence.shouldRender) return null;

  const isError = content.type === 'error';
  const isWarning = content.type === 'warning';

  return (
    <>
      <div
        className="alert-backdrop"
        data-state={presence.state}
        aria-hidden={!isOpen}
        inert={!isOpen}
        onClick={() => setIsOpen(false)}
      >
        <div ref={dialogRef} className="alert-container" role="alertdialog" aria-modal="true" aria-labelledby="global-alert-title" aria-describedby="global-alert-message" tabIndex={-1} onClick={e => e.stopPropagation()}>
          <div className={`alert-icon ${content.type}`}>
            {content.type === 'error' && (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            )}
            {content.type === 'warning' && (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            )}
            {content.type === 'info' && (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            )}
          </div>
          <h3 id="global-alert-title" className="alert-title">{content.title}</h3>
          <p id="global-alert-message" className="alert-message">{content.message}</p>
          <div className="alert-actions">
            <button 
              ref={actionButtonRef}
              className={`alert-btn ${isError ? 'btn-danger' : isWarning ? 'btn-warning' : 'btn-primary'}`} 
              onClick={() => setIsOpen(false)}
            >
              Mengerti
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .alert-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          opacity: 1;
          transition: opacity 0.2s ease;
        }

        .alert-container {
          background: white;
          border-radius: var(--radius-xl, 1rem);
          width: 100%;
          max-width: 400px;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          opacity: 1;
          transform: scale(1) translateY(0);
          transition: opacity 0.2s ease, transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .alert-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          margin: 0 auto 1.5rem;
        }

        .alert-icon.error {
          background: #fef2f2;
          color: #dc2626;
        }

        .alert-icon.warning {
          background: #fffbeb;
          color: #d97706;
        }

        .alert-icon.info {
          background: #eff6ff;
          color: #2563eb;
        }

        .alert-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }

        .alert-message {
          font-size: 0.95rem;
          color: #475569;
          line-height: 1.5;
          margin-bottom: 1.5rem;
        }

        .alert-btn {
          width: 100%;
          padding: 0.75rem 1rem;
          font-weight: 600;
          border-radius: var(--radius-lg, 0.5rem);
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }

        .btn-danger {
          background: #ef4444;
          color: white;
        }

        .btn-danger:hover {
          background: #dc2626;
        }

        .btn-warning {
          background: #f59e0b;
          color: white;
        }

        .btn-warning:hover {
          background: #d97706;
        }

        .btn-primary {
          background: var(--color-primary, #2563eb);
          color: white;
        }

        .btn-primary:hover {
          background: #1d4ed8;
        }

        .alert-backdrop[data-state='entering'],
        .alert-backdrop[data-state='exiting'] {
          opacity: 0;
        }

        .alert-backdrop[data-state='entering'] .alert-container,
        .alert-backdrop[data-state='exiting'] .alert-container {
          opacity: 0;
          transform: scale(0.96) translateY(10px);
        }

        .alert-backdrop[data-state='exiting'] {
          pointer-events: none;
        }
      `}</style>
    </>
  );
}
