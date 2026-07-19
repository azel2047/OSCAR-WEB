import { forwardRef } from 'react';
import { clsx } from 'clsx';

/**
 * Input / Textarea / Select component with Cyber Rainforest styling.
 *
 * @prop {string}  label     - visible label
 * @prop {string}  error     - validation error message
 * @prop {string}  hint      - helper text below input
 * @prop {node}    leftIcon  - icon inside left side
 * @prop {node}    rightIcon - icon inside right side
 * @prop {'input'|'textarea'|'select'} as - element type
 */
const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    leftIcon,
    rightIcon,
    as: Tag = 'input',
    className,
    id,
    required,
    children,
    rows = 4,
    ...props
  },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="font-display text-xs font-semibold tracking-widest uppercase text-text-muted"
        >
          {label}
          {required && <span className="text-neon-rose ml-1">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-4 text-text-muted pointer-events-none">
            {leftIcon}
          </span>
        )}

        {Tag === 'textarea' ? (
          <textarea
            ref={ref}
            id={inputId}
            rows={rows}
            required={required}
            className={clsx(
              'input-oscar resize-none',
              leftIcon  && '!pl-12',
              rightIcon && '!pr-12',
              error && 'border-neon-rose focus:border-neon-rose focus:shadow-[0_0_0_3px_rgba(255,79,123,0.15)]',
              className
            )}
            {...props}
          />
        ) : Tag === 'select' ? (
          <select
            ref={ref}
            id={inputId}
            required={required}
            className={clsx(
              'input-oscar appearance-none cursor-pointer',
              leftIcon  && '!pl-12',
              rightIcon && '!pr-12',
              error && 'border-neon-rose',
              className
            )}
            {...props}
          >
            {children}
          </select>
        ) : (
          <input
            ref={ref}
            id={inputId}
            required={required}
            className={clsx(
              'input-oscar',
              leftIcon  && '!pl-12',
              rightIcon && '!pr-12',
              error && 'border-neon-rose focus:border-neon-rose focus:shadow-[0_0_0_3px_rgba(255,79,123,0.15)]',
              className
            )}
            {...props}
          />
        )}

        {rightIcon && (
          <span className="absolute right-4 text-text-muted">
            {rightIcon}
          </span>
        )}
      </div>

      {error && (
        <p className="text-neon-rose text-xs flex items-center gap-1">
          <span>✕</span> {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-text-muted text-xs">{hint}</p>
      )}
    </div>
  );
});

export default Input;
