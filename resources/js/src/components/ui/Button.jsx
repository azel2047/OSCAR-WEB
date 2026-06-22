import { forwardRef, useRef, useCallback } from 'react';
import { clsx } from 'clsx';

/**
 * Magnetic button — cursor proximity pulls button slightly.
 * Falls back gracefully on touch devices.
 */
const Button = forwardRef(function Button(
  {
    children,
    variant   = 'primary', // 'primary' | 'solid' | 'ghost' | 'danger'
    size      = 'md',      // 'sm' | 'md' | 'lg'
    magnetic  = false,
    className,
    disabled,
    loading,
    leftIcon,
    rightIcon,
    ...props
  },
  ref
) {
  const btnRef = useRef(null);
  const resolvedRef = ref || btnRef;

  // Magnetic effect
  const handleMouseMove = useCallback(
    (e) => {
      if (!magnetic || disabled) return;
      const el   = resolvedRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) * 0.3;
      const dy   = (e.clientY - cy) * 0.3;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    },
    [magnetic, disabled]
  );

  const handleMouseLeave = useCallback(() => {
    if (!magnetic) return;
    const el = resolvedRef.current;
    if (!el) return;
    el.style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1)';
    el.style.transform  = 'translate(0, 0)';
    setTimeout(() => { if (el) el.style.transition = ''; }, 400);
  }, [magnetic]);

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs gap-1.5',
    md: 'px-6 py-3 text-sm gap-2',
    lg: 'px-8 py-4 text-base gap-2.5',
  };

  const variantClasses = {
    primary: 'btn btn-primary',
    solid:   'btn btn-solid',
    ghost:   'btn btn-ghost',
    danger:  'btn bg-transparent border border-neon-rose/40 text-neon-rose hover:border-neon-rose hover:bg-neon-rose/10',
  };

  return (
    <button
      ref={resolvedRef}
      disabled={disabled || loading}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={clsx(
        variantClasses[variant],
        sizeClasses[size],
        (disabled || loading) && 'opacity-50 cursor-not-allowed pointer-events-none',
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : leftIcon ? (
        <span className="flex-shrink-0">{leftIcon}</span>
      ) : null}
      {children}
      {rightIcon && !loading && (
        <span className="flex-shrink-0">{rightIcon}</span>
      )}
    </button>
  );
});

export default Button;
