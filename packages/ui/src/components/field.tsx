'use client'

import * as React from 'react'
import { Eye, EyeOff, TriangleAlert } from 'lucide-react'
import { cn } from '../lib/cn'

export interface FieldProps {
  /** Visible label. */
  label: React.ReactNode
  /** Id of the control inside (the label points at it). */
  htmlFor: string
  hint?: React.ReactNode
  hintId?: string
  error?: React.ReactNode
  errorId?: string
  /** Hide the label visually (e.g. a search box with a placeholder). */
  labelHidden?: boolean
  className?: string
  children: React.ReactNode
}

/**
 * Label + control + hint + error. Wire the control's `aria-describedby` to `errorId` then `hintId`
 * (`describedBy()` does it) and `aria-invalid` when there's an error.
 */
export function Field({
  label,
  htmlFor,
  hint,
  hintId,
  error,
  errorId,
  labelHidden,
  className,
  children,
}: FieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className={cn(
          'mb-2 font-semibold block font-mono text-[0.7rem] tracking-[0.2em] text-subtle uppercase',
          labelHidden && 'sr-only',
        )}
      >
        {label}
      </label>
      {children}
      {error && (
        <p id={errorId} className="mt-2 gap-1.5 text-sm flex text-danger">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>{error}</span>
        </p>
      )}
      {hint && (
        <div id={hintId} className="mt-2 text-xs text-muted">
          {hint}
        </div>
      )}
    </div>
  )
}

/** `aria-describedby` for a control: the error first, then the hint. */
export const describedBy = (...ids: (string | false | null | undefined)[]) =>
  ids.filter(Boolean).join(' ') || undefined

export interface InputProps extends React.ComponentProps<'input'> {
  /** Shows the invalid frame (also set `aria-invalid`). */
  invalid?: boolean
  /** Icon or text before the input (decorative). */
  start?: React.ReactNode
  /** Controls after the input (e.g. a clear or show-password button). */
  end?: React.ReactNode
  wrapperClassName?: string
}

/**
 * Chamfered text input. The focus ring is an inset shadow on the wrapper: an outer ring would be
 * clipped by the chamfer.
 */
export function Input({ invalid, start, end, className, wrapperClassName, ...props }: InputProps) {
  return (
    <div
      className={cn(
        'gap-3 px-4 flex items-center bg-surface-2 transition-shadow chamfer-sm',
        'focus-within:shadow-[inset_0_0_0_2px_var(--color-primary)]',
        invalid && 'shadow-[inset_0_0_0_2px_var(--color-danger)]',
        wrapperClassName,
      )}
    >
      {start}
      <input
        className={cn(
          'h-12 min-w-0 text-base w-full flex-1 bg-transparent outline-none placeholder:text-subtle',
          // The wrapper draws the ring; the input itself shows none.
          'focus-visible:outline-none',
          className,
        )}
        {...props}
      />
      {end}
    </div>
  )
}

export interface PasswordInputProps extends Omit<InputProps, 'type' | 'end'> {
  /** Accessible name of the show/hide toggle (state is carried by aria-pressed). */
  showLabel: string
}

/** Password input with a show/hide toggle. */
export function PasswordInput({ showLabel, id, ...props }: PasswordInputProps) {
  const [shown, setShown] = React.useState(false)
  return (
    <Input
      id={id}
      type={shown ? 'text' : 'password'}
      autoCapitalize="none"
      spellCheck={false}
      {...props}
      end={
        <button
          type="button"
          aria-pressed={shown}
          aria-controls={id}
          aria-label={showLabel}
          onClick={() => setShown((s) => !s)}
          className="size-10 -mr-3 grid shrink-0 cursor-pointer place-items-center text-muted focus-inset hover:text-foreground"
        >
          {shown ? (
            <EyeOff className="size-5" aria-hidden />
          ) : (
            <Eye className="size-5" aria-hidden />
          )}
        </button>
      }
    />
  )
}
