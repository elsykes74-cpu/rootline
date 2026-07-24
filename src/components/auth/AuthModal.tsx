import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { FOUNDING_EQUITY_EACH, useAuth } from '@/context/AuthContext'

export type AuthMode = 'signin' | 'signup'

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialMode?: AuthMode
  /** Called after a successful sign-in or sign-up (modal already closed). */
  onSuccess?: () => void
}

interface Certificate {
  seat: number
  name: string
}

export default function AuthModal({
  open,
  onOpenChange,
  initialMode = 'signup',
  onSuccess,
}: AuthModalProps) {
  const { login, signup, seatsRemaining } = useAuth()
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [certificate, setCertificate] = useState<Certificate | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isCreator, setIsCreator] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (open) {
      setMode(initialMode)
      setCertificate(null)
      setError(null)
      setBusy(false)
    }
  }, [open, initialMode])

  const resetForm = () => {
    setName('')
    setEmail('')
    setPassword('')
    setError(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      if (mode === 'signin') {
        login(email, password)
        onOpenChange(false)
        resetForm()
        onSuccess?.()
      } else {
        const result = signup({ name, email, password, isCreator })
        if (result.foundingSeat !== null) {
          // Founding 50 seat claimed — show the certificate moment;
          // "Enter the Line" below closes + fires onSuccess.
          setCertificate({ seat: result.foundingSeat, name: result.user.name })
          resetForm()
        } else {
          onOpenChange(false)
          resetForm()
          onSuccess?.()
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  const inputClass =
    'w-full border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-[#F5EFE6] placeholder:text-stone-500 outline-none transition-colors focus:border-[#D4A437]/70 focus:bg-white/[0.06]'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-white/10 bg-[#0A0908] p-0 text-[#F5EFE6] sm:max-w-md">
        {certificate ? (
          /* -------- Founding 50 certificate -------- */
          <div className="relative overflow-hidden px-8 py-10 text-center">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#B5372A] via-[#D4A437] to-[#1E6B4F]"
            />
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#D4A437]/60 bg-[#D4A437]/10">
              <span className="font-display text-2xl italic text-[#D4A437]">R</span>
            </div>
            <p className="mt-6 text-[10px] uppercase tracking-[0.35em] text-[#D4A437]">
              Founding Certificate
            </p>
            <DialogHeader className="mt-3">
              <DialogTitle className="font-display text-3xl text-[#F5EFE6]">
                Founding Creator #{certificate.seat} of 50
              </DialogTitle>
              <DialogDescription className="pt-2 text-stone-400">
                {certificate.name}, your seat at the table is permanent.
              </DialogDescription>
            </DialogHeader>
            <div className="mx-auto mt-6 max-w-xs border border-[#D4A437]/30 bg-white/[0.03] px-6 py-5">
              <p className="font-display text-4xl text-[#D4A437]">
                {FOUNDING_EQUITY_EACH}%
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-stone-400">
                Equity stake in ROOTLINE
              </p>
              <div className="my-4 h-px bg-white/10" />
              <p className="font-display text-lg italic text-[#F5EFE6]">
                Your masters stay yours.
              </p>
              <p className="mt-1 text-xs text-stone-500">
                100% ownership of your work. Always.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onOpenChange(false)
                onSuccess?.()
              }}
              className="mt-8 inline-block w-full bg-[#D4A437] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0A0908] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E5BB54]"
            >
              Enter the Line
            </button>
          </div>
        ) : (
          /* -------- Sign in / Sign up -------- */
          <div className="px-8 py-8">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#B5372A] via-[#D4A437] to-[#1E6B4F]"
            />
            <DialogHeader>
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#D4A437]">
                {mode === 'signup' ? 'Join the Line' : 'Welcome back'}
              </p>
              <DialogTitle className="mt-2 font-display text-3xl text-[#F5EFE6]">
                {mode === 'signup' ? 'Take your seat.' : 'Sign in to ROOTLINE.'}
              </DialogTitle>
              <DialogDescription className="pt-1 text-stone-400">
                {mode === 'signup'
                  ? seatsRemaining > 0
                    ? `${seatsRemaining} of 50 Founding Creator seats remain — 0.98% equity each, masters kept.`
                    : 'The Founding 50 is complete — join as a creator on our monetization lanes.'
                  : 'The table is set. Pick up where you left off.'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {mode === 'signup' && (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  autoComplete="name"
                  className={inputClass}
                />
              )}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                autoComplete="email"
                className={inputClass}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                className={inputClass}
              />

              {mode === 'signup' && (
                <label className="flex cursor-pointer items-start gap-3 border border-white/10 bg-white/[0.02] px-4 py-3 transition-colors hover:border-[#D4A437]/40">
                  <Checkbox
                    checked={isCreator}
                    onCheckedChange={(v) => setIsCreator(v === true)}
                    className="mt-0.5 border-white/30 data-[state=checked]:border-[#D4A437] data-[state=checked]:bg-[#D4A437] data-[state=checked]:text-[#0A0908]"
                  />
                  <span className="text-sm text-stone-300">
                    I am a creator
                    <span className="mt-0.5 block text-xs text-stone-500">
                      {seatsRemaining > 0
                        ? 'Claim a Founding 50 seat — 0.98% equity, your masters stay yours.'
                        : 'Monetization lanes from day one. The Founding 50 is complete.'}
                    </span>
                  </span>
                </label>
              )}

              {error && (
                <p className="border border-[#B5372A]/40 bg-[#B5372A]/10 px-4 py-2.5 text-xs text-[#E8A79F]">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="inline-flex w-full items-center justify-center gap-2 bg-[#D4A437] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0A0908] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E5BB54] disabled:opacity-60"
              >
                {busy && <Loader2 size={14} className="animate-spin" />}
                {mode === 'signup' ? 'Create account' : 'Sign in'}
              </button>
            </form>

            <button
              type="button"
              onClick={() => {
                setMode(mode === 'signup' ? 'signin' : 'signup')
                setError(null)
              }}
              className="mt-5 w-full text-center text-xs text-stone-400 underline decoration-white/25 underline-offset-4 transition-colors hover:text-[#D4A437] hover:decoration-[#D4A437]/60"
            >
              {mode === 'signup'
                ? 'Already on the line? Sign in'
                : 'New here? Join the Line'}
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
