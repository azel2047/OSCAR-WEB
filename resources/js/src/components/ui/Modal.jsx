import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import gsap from '@/animations/gsapConfig';
import { X } from 'lucide-react';
import Button from './Button';

/**
 * Modal — GSAP-animated overlay with backdrop blur.
 *
 * @prop {boolean}  isOpen
 * @prop {Function} onClose
 * @prop {string}   title
 * @prop {string}   size    - 'sm' | 'md' | 'lg' | 'xl' | 'full'
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
}) {
  const overlayRef = useRef(null);
  const panelRef   = useRef(null);

  const sizeClasses = {
    sm:   'max-w-md',
    md:   'max-w-xl',
    lg:   'max-w-3xl',
    xl:   'max-w-5xl',
    full: 'max-w-[95vw] max-h-[95vh]',
  };

  useEffect(() => {
    const overlay = overlayRef.current;
    const panel   = panelRef.current;
    if (!overlay || !panel) return;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      gsap.set(overlay, { display: 'flex' });
      gsap.fromTo(
        overlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: 'power2.out' }
      );
      gsap.fromTo(
        panel,
        { opacity: 0, y: 40, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'back.out(1.7)' }
      );
    } else {
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set(overlay, { display: 'none' });
          document.body.style.overflow = '';
        },
      });
    }
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && isOpen) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[500] items-center justify-center p-4"
      style={{
        display: 'none',
        backgroundColor: 'rgba(2,10,6,0.85)',
        backdropFilter: 'blur(8px)',
      }}
      onClick={closeOnBackdrop ? (e) => { if (e.target === overlayRef.current) onClose(); } : undefined}
    >
      <div
        ref={panelRef}
        className={`glass-card w-full ${sizeClasses[size]} overflow-hidden flex flex-col max-h-[90vh]`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle flex-shrink-0">
          {title && (
            <h2 className="font-display text-lg font-bold text-text-primary">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="ml-auto p-1.5 rounded-md text-text-muted hover:text-neon-teal hover:bg-neon-teal/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-border-subtle flex-shrink-0 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
