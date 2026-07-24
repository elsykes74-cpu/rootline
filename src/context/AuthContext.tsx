import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

/**
 * ROOTLINE — local-first demo backend.
 *
 * All state lives in localStorage under the `rootline:` namespace.
 * Passwords are stored as a salted FNV-1a hash. This is DEMO-GRADE ONLY —
 * it is not cryptographic and must be replaced with a real auth service
 * (server-side hashing, e.g. Argon2/bcrypt) before any production use.
 */

const NS = 'rootline:'
const K_USERS = `${NS}users`
const K_SESSION = `${NS}session`
const K_REGISTRY = `${NS}foundingCreators`
const K_FOUNDERS = `${NS}founders`

export const FOUNDING_SEATS_TOTAL = 50
export const FOUNDING_EQUITY_EACH = 0.98 // percent — 49% split equally across 50 seats
export const FOUNDER_EQUITY_EACH = 25.5 // percent — two founders hold 51%

export type Role = 'owner' | 'creator' | 'member'

export interface RootlineUser {
  id: string
  name: string
  email: string
  role: Role
  salt: string
  passwordHash: string
  /** Founding 50 seat number (1–50) when the account holds one. */
  seat: number | null
  createdAt: string
}

export interface FoundingCreator {
  seat: number
  name: string
  sampleData: boolean
  joinedAt: string
}

export interface FounderSlot {
  key: 'founder' | 'cofounder'
  title: 'Founder' | 'Co-Founder'
  name: string
}

export interface SignupResult {
  user: RootlineUser
  foundingSeat: number | null
}

interface AuthContextValue {
  user: RootlineUser | null
  isOwner: boolean
  founders: FounderSlot[]
  foundingCreators: FoundingCreator[]
  seatsFilled: number
  seatsRemaining: number
  login: (email: string, password: string) => RootlineUser
  signup: (input: {
    name: string
    email: string
    password: string
    isCreator: boolean
  }) => SignupResult
  logout: () => void
  renameFounder: (key: FounderSlot['key'], name: string) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

/* ---------------- demo-grade hashing (NOT cryptographically secure) ---------------- */

function fnv1a(str: string): string {
  // FNV-1a 32-bit — simple non-crypto hash, demo-grade only.
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0).toString(16).padStart(8, '0')
}

function makeSalt(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

function hashPassword(password: string, salt: string): string {
  return fnv1a(`${salt}::${password}::rootline`)
}

/* ---------------- storage helpers ---------------- */

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage full / unavailable — demo backend degrades silently */
  }
}

/* ---------------- seed data ---------------- */

function seedFounders(): FounderSlot[] {
  return [
    { key: 'founder', title: 'Founder', name: 'E. Sykes' },
    { key: 'cofounder', title: 'Co-Founder', name: 'J. Sykes' },
  ]
}

function seedUsers(): RootlineUser[] {
  // Demo owner account — email owner@rootline.com / password rootline51
  const salt = 'rootline-owner-seed'
  return [
    {
      id: 'u_owner',
      name: 'E. Sykes',
      email: 'owner@rootline.com',
      role: 'owner',
      salt,
      passwordHash: hashPassword('rootline51', salt),
      seat: null,
      createdAt: new Date('2024-01-12T09:00:00Z').toISOString(),
    },
  ]
}

const SAMPLE_FOUNDING: Array<[string, string]> = [
  ['Amara Okafor', '2025-11-02'],
  ['DeShawn Carter', '2025-11-04'],
  ['Zuri Bennett', '2025-11-07'],
  ['Kwame Mensah', '2025-11-10'],
  ['Imani Cole', '2025-11-14'],
  ['Malik Thornton', '2025-11-18'],
  ['Nia Washington', '2025-11-21'],
  ['Jelani Brooks', '2025-11-25'],
  ['Aaliyah Fontaine', '2025-11-28'],
  ['Terrence Hale', '2025-12-02'],
  ['Selam Tesfaye', '2025-12-05'],
  ['Darius Whitfield', '2025-12-09'],
  ['Kemi Adebayo', '2025-12-12'],
  ['Rosa Jiménez', '2025-12-15'],
  ['Jamal Onyema', '2025-12-18'],
  ['Tiana Baptiste', '2025-12-21'],
  ['Corey Ellison', '2025-12-26'],
  ['Fatou Diallo', '2025-12-29'],
  ['Andre Laveau', '2026-01-03'],
  ['Maya Redmond', '2026-01-07'],
  ['Isaiah Morman', '2026-01-11'],
  ['Adaeze Nwosu', '2026-01-15'],
  ['Solomon Rivers', '2026-01-19'],
]

function seedRegistry(): FoundingCreator[] {
  return SAMPLE_FOUNDING.map(([name, date], i) => ({
    seat: i + 1,
    name,
    sampleData: true,
    joinedAt: new Date(`${date}T12:00:00Z`).toISOString(),
  }))
}

function loadOrSeed<T>(key: string, seed: () => T): T {
  const existing = readJSON<T | null>(key, null)
  if (existing !== null) return existing
  const value = seed()
  writeJSON(key, value)
  return value
}

/* ---------------- provider ---------------- */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<RootlineUser[]>(() => loadOrSeed(K_USERS, seedUsers))
  const [registry, setRegistry] = useState<FoundingCreator[]>(() =>
    loadOrSeed(K_REGISTRY, seedRegistry),
  )
  const [founders, setFounders] = useState<FounderSlot[]>(() =>
    loadOrSeed(K_FOUNDERS, seedFounders),
  )
  const [sessionEmail, setSessionEmail] = useState<string | null>(() =>
    readJSON<string | null>(K_SESSION, null),
  )

  useEffect(() => writeJSON(K_USERS, users), [users])
  useEffect(() => writeJSON(K_REGISTRY, registry), [registry])
  useEffect(() => writeJSON(K_FOUNDERS, founders), [founders])
  useEffect(() => writeJSON(K_SESSION, sessionEmail), [sessionEmail])

  const user = useMemo(
    () => users.find((u) => u.email === sessionEmail) ?? null,
    [users, sessionEmail],
  )

  const login = useCallback(
    (email: string, password: string): RootlineUser => {
      const found = users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
      )
      if (!found || found.passwordHash !== hashPassword(password, found.salt)) {
        throw new Error('Email or password doesn’t match our records.')
      }
      setSessionEmail(found.email)
      return found
    },
    [users],
  )

  const signup = useCallback(
    (input: {
      name: string
      email: string
      password: string
      isCreator: boolean
    }): SignupResult => {
      const email = input.email.trim().toLowerCase()
      if (!input.name.trim()) throw new Error('Tell us your name.')
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
        throw new Error('That email doesn’t look right.')
      if (input.password.length < 6)
        throw new Error('Password needs at least 6 characters.')
      if (users.some((u) => u.email.toLowerCase() === email))
        throw new Error('An account with this email already exists.')

      // Founding 50 logic: creators who join while seats remain claim the next
      // seat and a 0.98% equity stake; they keep 100% of their masters.
      // Once 50 seats are filled, new creators join as standard creators
      // (monetization lanes, no equity).
      const seat =
        input.isCreator && registry.length < FOUNDING_SEATS_TOTAL
          ? registry.length + 1
          : null

      const salt = makeSalt()
      const newUser: RootlineUser = {
        id: `u_${Date.now().toString(36)}`,
        name: input.name.trim(),
        email,
        role: input.isCreator ? 'creator' : 'member',
        salt,
        passwordHash: hashPassword(input.password, salt),
        seat,
        createdAt: new Date().toISOString(),
      }
      setUsers((prev) => [...prev, newUser])
      if (seat !== null) {
        setRegistry((prev) => [
          ...prev,
          {
            seat,
            name: newUser.name,
            sampleData: false,
            joinedAt: newUser.createdAt,
          },
        ])
      }
      setSessionEmail(email)
      return { user: newUser, foundingSeat: seat }
    },
    [users, registry],
  )

  const logout = useCallback(() => setSessionEmail(null), [])

  const renameFounder = useCallback((key: FounderSlot['key'], name: string) => {
    setFounders((prev) => prev.map((f) => (f.key === key ? { ...f, name } : f)))
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isOwner: user?.role === 'owner',
      founders,
      foundingCreators: registry,
      seatsFilled: registry.length,
      seatsRemaining: FOUNDING_SEATS_TOTAL - registry.length,
      login,
      signup,
      logout,
      renameFounder,
    }),
    [user, founders, registry, login, signup, logout, renameFounder],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
