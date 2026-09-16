import { useState } from 'react'
import { useProducts } from '../hooks/useProducts'
import { FONT_MONO, COLORS } from '../data/constants'

// — Resalta el texto buscado dentro de un string
function HighlightText({ text, query }) {
  if (!query) return <span>{text}</span>
  const parts = text.split(new RegExp(`(${query})`, 'gi'))
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase()
          ? <mark key={i} style={{ background: `${COLORS.accent}44`, color: COLORS.accent, borderRadius: 2, padding: '0 2px' }}>{part}</mark>
          : <span key={i}>{part}</span>
      )}
    </span>
  )
}

// — Pantalla de carga animada
function LoadingScreen() {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: COLORS.bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      zIndex: 100, animation: 'fadeIn 0.3s ease',
    }}>
      <div style={{ marginBottom: 24, position: 'relative' }}>
        <div style={{
          width: 64, height: 64,
          border: `2px solid ${COLORS.border}`,
          borderTop: `2px solid ${COLORS.accent}`,
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24,
        }}>🍽</div>
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 3, color: COLORS.text, marginBottom: 6 }}>
        TORTAS Y TACOS <span style={{ color: COLORS.accent }}>MARY</span>
      </div>
      <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 2 }}>
        CARGANDO MENÚ...
      </div>
    </div>
  )
}

export default function CustomerView() {
  const { products, loading } = useProducts({ onlyAvailable: true })
  const [activeCategory, setActiveCategory]   = useState('Todos')
  const [search, setSearch]                   = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [viewMode, setViewMode]               = useState('grid') // 'grid' | 'list'

  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.category)))]

  const filtered = products.filter(p => {
    const matchCat    = activeCategory === 'Todos' || p.category === activeCategory
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
      || p.description?.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const featured = products.filter(p => p.featured)

  if (loading) return <LoadingScreen />

  return (
    <div style={{ fontFamily: FONT_MONO, background: COLORS.bg, minHeight: '100vh', color: COLORS.text }}>

      {/* HEADER */}
      <div style={{
        padding: '20px 20px 14px',
        borderBottom: `1px solid ${COLORS.border}`,
        position: 'sticky', top: 0,
        background: COLORS.bg, zIndex: 10,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 3, marginBottom: 4 }}>
              BIENVENIDO A
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 2 }}>
              TORTAS Y TACOS <span style={{ color: COLORS.accent }}>MARY</span>
            </div>
          </div>

          <input
            placeholder="Buscar en el menú..."
            value={search}
            onChange={e => { setSearch(e.target.value); setActiveCategory('Todos') }}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: COLORS.surface2,
              border: `1px solid ${COLORS.border2}`,
              color: COLORS.text, padding: '10px 14px',
              borderRadius: 8, fontSize: 13,
              fontFamily: FONT_MONO, outline: 'none', marginBottom: 12,
            }}
          />

          {/* Categorías + toggle vista */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2, flex: 1 }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                  background: activeCategory === cat ? COLORS.accent : COLORS.surface2,
                  color: activeCategory === cat ? '#000' : COLORS.textDim,
                  border: 'none', padding: '6px 14px', borderRadius: 20,
                  fontSize: 11, cursor: 'pointer', whiteSpace: 'nowrap',
                  fontFamily: FONT_MONO, fontWeight: activeCategory === cat ? 700 : 400,
                }}>{cat}</button>
              ))}
            </div>

            {/* Toggle grid/lista */}
            <div style={{ display: 'flex', background: COLORS.surface2, borderRadius: 6, padding: 3, flexShrink: 0 }}>
              {[
                { mode: 'grid', icon: '▦' },
                { mode: 'list', icon: '☰' },
              ].map(({ mode, icon }) => (
                <button key={mode} onClick={() => setViewMode(mode)} style={{
                  background: viewMode === mode ? COLORS.accent : 'transparent',
                  color: viewMode === mode ? '#000' : COLORS.textMuted,
                  border: 'none', width: 30, height: 28,
                  borderRadius: 4, cursor: 'pointer',
                  fontSize: 13, fontFamily: FONT_MONO,
                  transition: 'all 0.15s',
                }}>{icon}</button>
              ))}
            </div>
          </div>

          {/* Aviso ilustrativo */}
          <div style={{
            marginTop: 10, padding: '7px 12px',
            background: '#1a1400', border: `1px solid ${COLORS.accent}33`,
            borderRadius: 6, fontSize: 10,
            color: `${COLORS.accent}99`, letterSpacing: 0.5, lineHeight: 1.5,
          }}>
            Las imágenes son únicamente con fines ilustrativos. El producto final puede variar en presentación.
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 20px 40px' }}>

        {/* DESTACADOS */}
        {activeCategory === 'Todos' && !search && featured.length > 0 && (
          <div style={{ marginBottom: 36 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 3, height: 20, background: COLORS.accent, borderRadius: 2 }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.accent, letterSpacing: 4 }}>
                LO MÁS PEDIDO
              </span>
              <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, ${COLORS.accent}33, transparent)` }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
              {featured.map(item => (
                <div key={item.id} onClick={() => setSelectedProduct(item)} style={{
                  background: COLORS.surface,
                  border: `1px solid ${COLORS.accent}44`,
                  borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
                  transition: 'transform 0.15s, border-color 0.15s',
                  position: 'relative',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = COLORS.accent }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = `${COLORS.accent}44` }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: COLORS.accent }} />
                  {item.image_url
                    ? <img src={item.image_url} alt={item.name} style={{ width: '100%', height: 130, objectFit: 'cover' }} />
                    : <div style={{ height: 130, background: COLORS.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: COLORS.textMuted, letterSpacing: 2 }}>SIN IMAGEN</div>
                  }
                  <div style={{ padding: '10px 12px 14px' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.text, marginBottom: 6, lineHeight: 1.3 }}>{item.name}</div>
                    <div style={{ fontSize: 14, color: COLORS.accent, fontWeight: 700 }}>Q{parseFloat(item.price).toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TÍTULO SECCIÓN */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 3, height: 16, background: COLORS.border2, borderRadius: 2 }} />
            <span style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 4, fontWeight: 600 }}>
              {search
                ? `${filtered.length} RESULTADO${filtered.length !== 1 ? 'S' : ''} PARA "${search.toUpperCase()}"`
                : activeCategory === 'Todos' ? 'TODO EL MENÚ' : activeCategory.toUpperCase()
              }
            </span>
          </div>
        </div>

        {/* PRODUCTOS — GRID */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#333', fontSize: 12, marginTop: 60 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
            No se encontraron productos
          </div>
        ) : viewMode === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
            {filtered.map(item => (
              <div key={item.id} onClick={() => setSelectedProduct(item)} style={{
                background: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
                transition: 'transform 0.15s, border-color 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = '#333' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = COLORS.border }}>
                {item.image_url
                  ? <img src={item.image_url} alt={item.name} style={{ width: '100%', height: 130, objectFit: 'cover' }} />
                  : <div style={{ height: 130, background: COLORS.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: COLORS.textMuted, letterSpacing: 2 }}>SIN IMAGEN</div>
                }
                <div style={{ padding: '10px 12px 14px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.text, marginBottom: 6, lineHeight: 1.3 }}>
                    <HighlightText text={item.name} query={search} />
                  </div>
                  <div style={{ fontSize: 14, color: COLORS.accent, fontWeight: 700 }}>Q{parseFloat(item.price).toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>

        ) : (
          /* PRODUCTOS — LISTA */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filtered.map(item => (
              <div key={item.id} onClick={() => setSelectedProduct(item)} style={{
                display: 'flex', gap: 12, alignItems: 'center',
                padding: '12px 8px',
                borderBottom: `1px solid ${COLORS.border}`,
                cursor: 'pointer', transition: 'background 0.15s',
                borderRadius: 8,
              }}
                onMouseEnter={e => e.currentTarget.style.background = COLORS.surface}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                {item.image_url
                  ? <img src={item.image_url} alt={item.name} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                  : <div style={{ width: 56, height: 56, background: COLORS.surface2, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: COLORS.textMuted, flexShrink: 0 }}>IMG</div>
                }
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>
                    <HighlightText text={item.name} query={search} />
                  </div>
                  {item.description && (
                    <div style={{ fontSize: 11, color: COLORS.textMuted, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <HighlightText text={item.description} query={search} />
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.accent, flexShrink: 0 }}>
                  Q{parseFloat(item.price).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedProduct && (
        <div onClick={() => setSelectedProduct(null)} style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.85)', zIndex: 50,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          animation: 'fadeIn 0.2s ease',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: COLORS.surface,
            borderRadius: '20px 20px 0 0',
            width: '100%', maxWidth: 560,
            overflow: 'hidden', animation: 'slideUp 0.25s ease',
          }}>
            {selectedProduct.featured && (
              <div style={{
                background: COLORS.accentBg,
                borderBottom: `1px solid ${COLORS.accent}33`,
                padding: '6px 20px', display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <div style={{ width: 2, height: 12, background: COLORS.accent, borderRadius: 1 }} />
                <span style={{ fontSize: 10, color: COLORS.accent, letterSpacing: 3, fontWeight: 700 }}>LO MÁS PEDIDO</span>
              </div>
            )}
            {selectedProduct.image_url
              ? <img src={selectedProduct.image_url} alt={selectedProduct.name} style={{ width: '100%', height: 220, objectFit: 'cover' }} />
              : <div style={{ height: 160, background: COLORS.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: COLORS.textMuted, letterSpacing: 2 }}>SIN IMAGEN</div>
            }
            <div style={{ padding: '20px 24px 32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, flex: 1, marginRight: 12 }}>
                  {selectedProduct.name}
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.accent, whiteSpace: 'nowrap' }}>
                  Q{parseFloat(selectedProduct.price).toFixed(2)}
                </div>
              </div>
              {selectedProduct.description && (
                <div style={{ fontSize: 13, color: COLORS.textDim, lineHeight: 1.6, marginBottom: 16 }}>
                  {selectedProduct.description}
                </div>
              )}
              <button onClick={() => setSelectedProduct(null)} style={{
                width: '100%', marginTop: 4,
                background: COLORS.surface2,
                border: `1px solid ${COLORS.border2}`,
                color: COLORS.textDim, padding: '12px',
                borderRadius: 10, fontSize: 12,
                cursor: 'pointer', fontFamily: FONT_MONO,
              }}>
                Cerrar
              </button>
              <div style={{ marginTop: 12, fontSize: 10, color: COLORS.textMuted, textAlign: 'center', lineHeight: 1.5 }}>
                * Las imágenes son únicamente con fines ilustrativos.
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        ::-webkit-scrollbar { width: 0; height: 4px; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 2px; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  )
}