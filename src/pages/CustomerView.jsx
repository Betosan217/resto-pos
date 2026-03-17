import { useState } from 'react'
import { useProducts } from '../hooks/useProducts'

export default function CustomerView() {
  const { products, loading } = useProducts()
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [search, setSearch] = useState('')

  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.category)))]

  const filtered = products.filter(p => {
    const matchCat = activeCategory === 'Todos' || p.category === activeCategory
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const featured = products.filter(p => p.featured)

  return (
    <div style={{ fontFamily: "'JetBrains Mono','Courier New',monospace", background: '#0d0d0d', minHeight: '100vh', color: '#e5e5e5', maxWidth: 480, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid #1a1a1a', position: 'sticky', top: 0, background: '#0d0d0d', zIndex: 10 }}>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 2, marginBottom: 12 }}>
          🍽 RESTO<span style={{ color: '#f59e0b' }}>MENÚ</span>
        </div>
        <input placeholder="🔍  Buscar..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', boxSizing: 'border-box', background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#e5e5e5', padding: '10px 14px', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none', marginBottom: 12 }} />
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              background: activeCategory === cat ? '#f59e0b' : '#1a1a1a',
              color: activeCategory === cat ? '#000' : '#888',
              border: 'none', padding: '6px 14px', borderRadius: 20, fontSize: 11,
              cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit',
              fontWeight: activeCategory === cat ? 700 : 400,
            }}>{cat}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px 16px 40px' }}>
        {/* Destacados */}
        {activeCategory === 'Todos' && featured.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 10, color: '#f59e0b', letterSpacing: 3, marginBottom: 12 }}>⭐ DESTACADOS</div>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
              {featured.map(item => (
                <div key={item.id} style={{ minWidth: 160, background: '#131313', border: '1px solid #2a2010', borderRadius: 10, padding: 12, flexShrink: 0 }}>
                  {item.image_url
                    ? <img src={item.image_url} alt={item.name} style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 6, marginBottom: 8 }} />
                    : <div style={{ fontSize: 36, textAlign: 'center', marginBottom: 8 }}>{item.emoji}</div>
                  }
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{item.name}</div>
                  <div style={{ fontSize: 13, color: '#f59e0b', fontWeight: 700 }}>${item.price.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lista de productos */}
        {loading ? (
          <div style={{ textAlign: 'center', color: '#444', fontSize: 12, marginTop: 40 }}>Cargando menú...</div>
        ) : filtered.map(item => (
          <div key={item.id} style={{ display: 'flex', gap: 12, padding: '14px 0', borderBottom: '1px solid #1a1a1a', alignItems: 'center' }}>
            {item.image_url
              ? <img src={item.image_url} alt={item.name} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
              : <div style={{ width: 64, height: 64, background: '#1a1a1a', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>{item.emoji}</div>
            }
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{item.name}</div>
              {item.description && <div style={{ fontSize: 11, color: '#555', lineHeight: 1.4, marginBottom: 6 }}>{item.description}</div>}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#f59e0b' }}>${item.price.toFixed(2)}</span>
                {item.preparation_time && <span style={{ fontSize: 10, color: '#444' }}>⏱ {item.preparation_time} min</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
        ::-webkit-scrollbar { width: 0; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  )
}