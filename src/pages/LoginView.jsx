import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FONT_MONO, COLORS } from '../data/constants'

const S = {
  wrap: {
    fontFamily: FONT_MONO,
    background: COLORS.bg,
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: COLORS.text,
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 380,
  },
  label: {
    fontSize: 10,
    color: COLORS.textMuted,
    letterSpacing: 2,
    marginBottom: 6,
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    background: COLORS.surface,
    border: `1px solid ${COLORS.border2}`,
    color: COLORS.text,
    padding: '12px 14px',
    borderRadius: 8,
    fontSize: 13,
    fontFamily: FONT_MONO,
    outline: 'none',
  },
}

export default function LoginView() {
  const { signIn, session } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  // Si ya hay sesión activa, redirige directo al admin
  if (session) {
    navigate('/admin', { replace: true })
    return null
  }

  async function handleLogin() {
    if (!email || !password) return
    setLoading(true)
    setError(null)

    const { success, error } = await signIn(email, password)

    if (success) {
      navigate('/admin', { replace: true })
    } else {
      setError(error)
    }
    setLoading(false)
  }

  const canSubmit = email && password && !loading

  return (
    <div style={S.wrap}>
      <div style={S.card}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🍽</div>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: 3 }}>
            TORTAS Y TACOS <span style={{ color: COLORS.accent }}>MARY</span>
          </div>
          <div style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 8, letterSpacing: 2 }}>
            PANEL DE ADMINISTRACIÓN
          </div>
        </div>

        {/* Formulario */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <div style={S.label}>EMAIL</div>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="tu@email.com"
              style={S.input}
            />
          </div>

          <div>
            <div style={S.label}>CONTRASEÑA</div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="••••••••"
              style={S.input}
            />
          </div>

          {error && (
            <div style={{
              fontSize: 11,
              color: COLORS.danger,
              background: COLORS.dangerBg,
              border: `1px solid ${COLORS.danger}22`,
              padding: '10px 14px',
              borderRadius: 6,
            }}>
              ⚠ {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={!canSubmit}
            style={{
              background: canSubmit ? COLORS.accent : COLORS.surface2,
              color: canSubmit ? '#000' : COLORS.textMuted,
              border: 'none',
              padding: '13px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: canSubmit ? 'pointer' : 'default',
              fontFamily: FONT_MONO,
              marginTop: 4,
              transition: 'all 0.15s',
            }}
          >
            {loading ? 'ENTRANDO...' : 'ENTRAR →'}
          </button>
        </div>

        <div style={{ textAlign: 'center', fontSize: 10, color: '#2a2a2a', marginTop: 32 }}>
          Solo personal autorizado
        </div>
      </div>
    </div>
  )
}