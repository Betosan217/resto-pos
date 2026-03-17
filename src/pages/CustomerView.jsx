import { useState } from 'react'
import { useProducts } from '../hooks/useProducts'

export default function CustomerView() {
  const { products, loading } = useProducts()
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [search, setSearch] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)

  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.category)))]

  const filtered = products.filter(p => {
    const matchCat = activeCategory === 'Todos' || p.category === activeCategory
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const featured = products.filter(p => p.featured)

  return (
    <div style={{
      fontFamily: "'JetBrains Mono','Courier New',monospace",
      background: '#0d0d0d',
      minHeight: '100vh',
      color: '#e5e5e5',
    }}>

      {/* Header */}
      <div style={{
        padding: '20px 24px 16px',
        borderBottom: '1px solid #1a1a1a',
        position: 'sticky', top: 0,
        background: '#0d0d0d',
        zIndex: 10,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 2, marginBottom: 12 }}>
            🍽TORTAS Y TACOS <span style={{ color: '#f59e0b' }}>MARY</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 2, marginBottom: 12 }}>
            <span style={{ color: '#f59e0b' }}>MENÚ</span>
          </div>

          <input
            placeholder="🔍  Buscar..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: '#1a1a1a', border: '1px solid #2a2a2a',
              color: '#e5e5e5', padding: '10px 14px', borderRadius: 8,
              fontSize: 13, fontFamily: 'inherit', outline: 'none', marginBottom: 12,
            }}
          />
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                background: activeCategory === cat ? '#f59e0b' : '#1a1a1a',
                color: activeCategory === cat ? '#000' : '#888',
                border: 'none', padding: '6px 14px', borderRadius: 20,
                fontSize: 11, cursor: 'pointer', whiteSpace: 'nowrap',
                fontFamily: 'inherit', fontWeight: activeCategory === cat ? 700 : 400,
              }}>{cat}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 24px 40px' }}>

        {/* Destacados */}
        {activeCategory === 'Todos' && !search && featured.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 10, color: '#f59e0b', letterSpacing: 3, marginBottom: 14 }}>⭐ DESTACADOS</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
              {featured.map(item => (
                <div key={item.id} onClick={() => setSelectedProduct(item)} style={{
                  background: '#131313', border: '1px solid #2a2010',
                  borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
                  transition: 'transform 0.15s, border-color 0.15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = '#f59e0b' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#2a2010' }}>
                  {item.image_url
                    ? <img src={item.image_url} alt={item.name} style={{ width: '100%', height: 120, objectFit: 'cover' }} />
                    : <div style={{ height: 120, background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>{item.emoji}</div>
                  }
                  <div style={{ padding: '10px 12px' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{item.name}</div>
                    <div style={{ fontSize: 13, color: '#f59e0b', fontWeight: 700 }}>Q{item.price.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Título sección */}
        {!search && (
          <div style={{ fontSize: 10, color: '#444', letterSpacing: 3, marginBottom: 14 }}>
            {activeCategory === 'Todos' ? 'TODO EL MENÚ' : activeCategory.toUpperCase()}
          </div>
        )}

        {/* Grid de productos */}
        {loading ? (
          <div style={{ textAlign: 'center', color: '#444', fontSize: 12, marginTop: 60 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🍽</div>
            Cargando menú...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#333', fontSize: 12, marginTop: 60 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
            No se encontraron productos
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: 12,
          }}>
            {filtered.map(item => (
              <div key={item.id} onClick={() => setSelectedProduct(item)} style={{
                background: '#111', border: '1px solid #1f1f1f',
                borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
                transition: 'transform 0.15s, border-color 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = '#333' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#1f1f1f' }}>
                {item.image_url
                  ? <img src={item.image_url} alt={item.name} style={{ width: '100%', height: 130, objectFit: 'cover' }} />
                  : <div style={{ height: 130, background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44 }}>{item.emoji}</div>
                }
                <div style={{ padding: '10px 12px 14px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 6, lineHeight: 1.3 }}>{item.name}</div>
                  <div style={{ fontSize: 14, color: '#f59e0b', fontWeight: 700 }}>Q{item.price.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal detalle producto */}
      {selectedProduct && (
        <div
          onClick={() => setSelectedProduct(null)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 50, display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            padding: '0',
          }}>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#111',
              borderRadius: '20px 20px 0 0',
              width: '100%',
              maxWidth: 560,
              overflow: 'hidden',
              animation: 'slideUp 0.25s ease',
            }}>
            {/* Imagen del modal */}
            {selectedProduct.image_url
              ? <img src={selectedProduct.image_url} alt={selectedProduct.name} style={{ width: '100%', height: 220, objectFit: 'cover' }} />
              : <div style={{ height: 180, background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 }}>{selectedProduct.emoji}</div>
            }

            {/* Info */}
            <div style={{ padding: '20px 24px 32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', flex: 1, marginRight: 12 }}>{selectedProduct.name}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#f59e0b', whiteSpace: 'nowrap' }}>Q{selectedProduct.price.toFixed(2)}</div>
              </div>

              {selectedProduct.description && (
                <div style={{ fontSize: 13, color: '#888', lineHeight: 1.6, marginBottom: 14 }}>
                  {selectedProduct.description}
                </div>
              )}

              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                {selectedProduct.preparation_time && (
                  <span style={{ fontSize: 11, color: '#555', background: '#1a1a1a', padding: '4px 10px', borderRadius: 20 }}>
                    ⏱ {selectedProduct.preparation_time} min
                  </span>
                )}
                {selectedProduct.featured && (
                  <span style={{ fontSize: 11, color: '#f59e0b', background: '#1a0f00', padding: '4px 10px', borderRadius: 20 }}>
                    ⭐ Destacado
                  </span>
                )}
              </div>

              {/* Botón cerrar */}
              <button
                onClick={() => setSelectedProduct(null)}
                style={{
                  width: '100%', marginTop: 20,
                  background: '#1a1a1a', border: '1px solid #2a2a2a',
                  color: '#888', padding: '12px', borderRadius: 10,
                  fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                }}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        ::-webkit-scrollbar { width: 0; height: 4px; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 2px; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  )
}