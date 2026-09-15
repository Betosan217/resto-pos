import { useState } from 'react'
import { useProducts } from '../hooks/useProducts'
import { FONT_MONO, COLORS } from '../data/constants'

export default function CustomerView() {
  const { products, loading } = useProducts({ onlyAvailable: true })
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [search, setSearch]                 = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)

  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.category)))]

  const filtered = products.filter(p => {
    const matchCat    = activeCategory === 'Todos' || p.category === activeCategory
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const featured = products.filter(p => p.featured)

  return (
    <div style={{ fontFamily: FONT_MONO, background: COLORS.bg, minHeight: '100vh', color: COLORS.text }}>

      {/* HEADER */}
      <div style={{
        padding: '20px 24px 16px',
        borderBottom: `1px solid ${COLORS.border}`,
        position: 'sticky', top: 0,
        background: COLORS.bg, zIndex: 10,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: COLORS.textMuted, letterSpacing: 3, marginBottom: 4 }}>
              BIENVENIDO A
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 2 }}>
              TORTAS Y TACOS <span style={{ color: COLORS.accent }}>MARY</span>
            </div>
          </div>
          <input
            placeholder="Buscar en el menú..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: COLORS.surface2,
              border: `1px solid ${COLORS.border2}`,
              color: COLORS.text, padding: '10px 14px',
              borderRadius: 8, fontSize: 13,
              fontFamily: FONT_MONO, outline: 'none', marginBottom: 12,
            }}
          />
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
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
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 24px 40px' }}>

        {/* DESTACADOS */}
        {activeCategory === 'Todos' && !search && featured.length > 0 && (
          <div style={{ marginBottom: 36 }}>
            {/* Título destacados sin emoji */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16,
            }}>
              <div style={{
                width: 3, height: 20,
                background: COLORS.accent,
                borderRadius: 2,
              }} />
              <span style={{
                fontSize: 11, fontWeight: 700,
                color: COLORS.accent, letterSpacing: 4,
              }}>
                LO MÁS PEDIDO
              </span>
              <div style={{
                flex: 1, height: 1,
                background: `linear-gradient(to right, ${COLORS.accent}33, transparent)`,
              }} />
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
                  {/* Banda superior destacado */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0,
                    height: 3, background: COLORS.accent,
                  }} />
                  {item.image_url
                    ? <img src={item.image_url} alt={item.name} style={{ width: '100%', height: 130, objectFit: 'cover' }} />
                    : <div style={{ height: 130, background: COLORS.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44 }}>{item.emoji}</div>
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
        {!search && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 3, height: 16, background: COLORS.border2, borderRadius: 2 }} />
            <span style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 4, fontWeight: 600 }}>
              {activeCategory === 'Todos' ? 'TODO EL MENÚ' : activeCategory.toUpperCase()}
            </span>
          </div>
        )}

        {/* GRID PRODUCTOS */}
        {loading ? (
          <div style={{ textAlign: 'center', color: COLORS.textMuted, fontSize: 12, marginTop: 60 }}>
            Cargando menú...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#333', fontSize: 12, marginTop: 60 }}>
            No se encontraron productos
          </div>
        ) : (
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
                  : <div style={{ height: 130, background: COLORS.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44 }}>{item.emoji}</div>
                }
                <div style={{ padding: '10px 12px 14px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.text, marginBottom: 6, lineHeight: 1.3 }}>{item.name}</div>
                  <div style={{ fontSize: 14, color: COLORS.accent, fontWeight: 700 }}>Q{parseFloat(item.price).toFixed(2)}</div>
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
          background: 'rgba(0,0,0,0.85)',
          zIndex: 50, display: 'flex',
          alignItems: 'flex-end', justifyContent: 'center',
          animation: 'fadeIn 0.2s ease',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: COLORS.surface,
            borderRadius: '20px 20px 0 0',
            width: '100%', maxWidth: 560,
            overflow: 'hidden',
            animation: 'slideUp 0.25s ease',
          }}>
            {/* Banda destacado en modal */}
            {selectedProduct.featured && (
              <div style={{
                background: COLORS.accentBg,
                borderBottom: `1px solid ${COLORS.accent}33`,
                padding: '6px 20px',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <div style={{ width: 2, height: 12, background: COLORS.accent, borderRadius: 1 }} />
                <span style={{ fontSize: 10, color: COLORS.accent, letterSpacing: 3, fontWeight: 700 }}>
                  LO MÁS PEDIDO
                </span>
              </div>
            )}

            {selectedProduct.image_url
              ? <img src={selectedProduct.image_url} alt={selectedProduct.name} style={{ width: '100%', height: 220, objectFit: 'cover' }} />
              : <div style={{ height: 180, background: COLORS.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 }}>{selectedProduct.emoji}</div>
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
                <div style={{ fontSize: 13, color: COLORS.textDim, lineHeight: 1.6, marginBottom: 14 }}>
                  {selectedProduct.description}
                </div>
              )}

              {selectedProduct.preparation_time && (
                <div style={{ fontSize: 11, color: COLORS.textMuted, background: COLORS.surface2, display: 'inline-block', padding: '4px 10px', borderRadius: 20, marginBottom: 16 }}>
                  Tiempo aprox. {selectedProduct.preparation_time} min
                </div>
              )}

              <button onClick={() => setSelectedProduct(null)} style={{
                width: '100%', marginTop: 8,
                background: COLORS.surface2,
                border: `1px solid ${COLORS.border2}`,
                color: COLORS.textDim, padding: '12px',
                borderRadius: 10, fontSize: 12,
                cursor: 'pointer', fontFamily: FONT_MONO,
              }}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}