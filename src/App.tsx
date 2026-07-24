import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import Owner from './pages/Owner'
import { AuthProvider } from './context/AuthContext'
import { SupabaseAuthProvider } from './lib/auth'

export default function App() {
  return (
    <SupabaseAuthProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/owner" element={<Owner />} />
        </Routes>
      </AuthProvider>
    </SupabaseAuthProvider>
  )
}
