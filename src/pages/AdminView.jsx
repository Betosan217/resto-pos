import { useState } from 'react'
import { useProducts } from '../hooks/useProducts'
import { useOrders } from '../hooks/useOrders'
import { STATUS_CONFIG } from '../data/constants'
import toast, { Toaster } from 'react-hot-toast'

export default function AdminView() {
  const { products, loading: loadingProducts } = useProducts()
  const { orders, placeOrder, updateStatus, deleteOrder } = useOrders()

  const [currentItems, setCurrentItems] = useState([])
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [activeOrder, setActiveOrder] = useState(null)
  const [tableNum, setTableNum] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('todos')
  const [note, setNote] = useState('')

  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.category)))]

  const filteredProducts = products.filter(p => {
    const matchCat = activeCategory === 'Todos' || p.category === activeCategory
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  function addItem(product) {
    setCurrentItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...product, qty: 1 }]
    })
  }

  function removeItem(id) {
    setCurrentItems(prev => {
      const item = prev.find(i => i.id === id)
      if (item.qty === 1) return prev.filter(i => i.id !== id)
      return prev.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i)
    })
  }

  async function handlePlaceOrder() {
    if (!currentItems.length) return
    const toastId = toast.loading('Enviando orden...')
    const { success, error } = await placeOrder({
      tableNumber: tableNum || 'Sin mesa',
      items: currentItems,
      note,
    })
    if (success) {
      toast.success('¡Orden enviada!', { id: toastId })
      setCurrentItems([])
      setTableNum('')
      setNote('')
    } else {
      toast.error(`Error: ${error}`, { id: toastId })
    }
  }

  async function handleUpdateStatus(orderId, status) {
    await updateStatus(orderId, status)
    toast.success(`Estado actualizado a ${STATUS_CONFIG[status].label}`)
  }

  const currentTotal = currentItems.reduce((s, i) => s + i.price * i.qty, 0)
  const visibleOrders = filterStatus === 'todos' ? orders : orders.filter(o => o.status === filterStatus)

  const S = {
    wrap: { fontFamily: "'JetBrains Mono','Courier New',monospace", background: '#0d0d0d', minHeight: '100vh', color: '#e5e5e5', display: 'grid', gridTemplateColumns: '1fr 320px', gridTemplateRows: '56px 1fr', height: '100vh', overflow: 'hidden' },
    header: { gridColumn: '1 / -1', background: '#111', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 16 },
  }

  return (
    <div style={S.wrap}>
      <Toaster position="top-right" toastOptions={{ style: { background: '#1a1a1a', color: '#e5e5e5', border: '1px solid #2a2a2a', fontFamily: 'inherit', fontSize: 12 } }} />

      {/* HEADER */}
      <header style={S.header}>
        <span style={{ fontSize: 22 }}>🍽</span>
        <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: 2, color: '#fff' }}>RESTO<span style={{ color: '#f59e0b' }}>POS</span></span>
        <span style={{ color: '#444', margin: '0 8px' }}>|</span>
        <span style={{ color: '#666', fontSize: 12 }}>{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 16, fontSize: 12, color: '#555' }}>
          <span>Órdenes: <b style={{ color: '#e5e5e5' }}>{orders.length}</b></span>
          <span>Pendientes: <b style={{ color: '#fbbf24' }}>{orders.filter(o => o.status === 'pendiente').length}</b></span>
          <span>Total día: <b style={{ color: '#34d399' }}>${orders.reduce((s, o) => s + o.total, 0).toFixed(2)}</b></span>
        </div>
      </header>

      {/* LEFT — MENU */}
      <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr auto auto', overflow: 'hidden', borderRight: '1px solid #1a1a1a' }}>
        <div style={{ padding: '12px 16px', background: '#111', borderBottom: '1px solid #1a1a1a' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <input placeholder="🔍  Buscar producto..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              style={{ flex: 1, background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#e5e5e5', padding: '8px 12px', borderRadius: 6, fontSize: 12, fontFamily: 'inherit', outline: 'none' }} />
            <input placeholder="Mesa" value={tableNum} onChange={e => setTableNum(e.target.value)}
              style={{ width: 70, background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#e5e5e5', padding: '8px 12px', borderRadius: 6, fontSize: 12, fontFamily: 'inherit', outline: 'none', textAlign: 'center' }} />
          </div>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                background: activeCategory === cat ? '#f59e0b' : '#1a1a1a',
                color: activeCategory === cat ? '#000' : '#888',
                border: 'none', padding: '5px 12px', borderRadius: 4, fontSize: 11,
                cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit',
                fontWeight: activeCategory === cat ? 700 : 400,
              }}>{cat}</button>
            ))}
          </div>
        </div>

        {/* Products grid */}
        <div style={{ overflowY: 'auto', padding: 12, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 8, alignContent: 'start' }}>
          {loadingProducts ? (
            <div style={{ color: '#444', fontSize: 12, gridColumn: '1/-1', textAlign: 'center', marginTop: 40 }}>Cargando productos...</div>
          ) : filteredProducts.map(item => (
            <button key={item.id} onClick={() => addItem(item)} style={{ background: '#131313', border: '1px solid #1f1f1f', borderRadius: 8, padding: '14px 10px', cursor: 'pointer', textAlign: 'center', position: 'relative', fontFamily: 'inherit', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.background = '#1a1a14' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#1f1f1f'; e.currentTarget.style.background = '#131313' }}>
              {item.image_url
                ? <img src={item.image_url} alt={item.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, marginBottom: 6 }} />
                : <div style={{ fontSize: 28, marginBottom: 6 }}>{item.emoji}</div>
              }
              <div style={{ fontSize: 11, color: '#ccc', marginBottom: 4, lineHeight: 1.3 }}>{item.name}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b' }}>${item.price.toFixed(2)}</div>
              {currentItems.find(i => i.id === item.id) && (
                <div style={{ position: 'absolute', top: 6, right: 6, background: '#f59e0b', color: '#000', borderRadius: '50%', width: 18, height: 18, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {currentItems.find(i => i.id === item.id).qty}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Current order items */}
        {currentItems.length > 0 && (
          <div style={{ borderTop: '1px solid #1a1a1a', background: '#111', maxHeight: 180, overflowY: 'auto' }}>
            {currentItems.map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', borderBottom: '1px solid #1a1a1a', gap: 8 }}>
                <span style={{ fontSize: 14 }}>{item.emoji}</span>
                <span style={{ flex: 1, fontSize: 11, color: '#ccc' }}>{item.name}</span>
                <button onClick={() => removeItem(item.id)} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#888', width: 22, height: 22, borderRadius: 4, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>−</button>
                <span style={{ minWidth: 20, textAlign: 'center', fontSize: 12, fontWeight: 700 }}>{item.qty}</span>
                <button onClick={() => addItem(item)} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#888', width: 22, height: 22, borderRadius: 4, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>+</button>
                <span style={{ minWidth: 50, textAlign: 'right', fontSize: 12, color: '#f59e0b', fontWeight: 700 }}>${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Order footer */}
        <div style={{ padding: '12px 16px', background: '#0d0d0d', borderTop: '1px solid #1a1a1a' }}>
          <input placeholder="Nota especial (alergias, modificaciones...)" value={note} onChange={e => setNote(e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#e5e5e5', padding: '8px 12px', borderRadius: 6, fontSize: 11, fontFamily: 'inherit', outline: 'none', marginBottom: 10 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: 11, color: '#555' }}>{currentItems.reduce((s, i) => s + i.qty, 0)} items · Mesa {tableNum || '—'}</span>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>${currentTotal.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setCurrentItems([])} style={{ background: 'transparent', border: '1px solid #2a2a2a', color: '#555', padding: '10px 16px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>Limpiar</button>
              <button onClick={handlePlaceOrder} disabled={!currentItems.length} style={{ background: currentItems.length ? '#f59e0b' : '#1a1a1a', color: currentItems.length ? '#000' : '#444', border: 'none', padding: '10px 24px', borderRadius: 6, cursor: currentItems.length ? 'pointer' : 'default', fontSize: 13, fontWeight: 700, fontFamily: 'inherit' }}>
                ENVIAR ORDEN →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT — ORDERS PANEL */}
      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#0a0a0a' }}>
        <div style={{ padding: '12px 12px 0', borderBottom: '1px solid #1a1a1a' }}>
          <div style={{ fontSize: 10, color: '#444', letterSpacing: 2, marginBottom: 8 }}>ÓRDENES ACTIVAS</div>
          <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
            {['todos', 'nuevo', 'pendiente', 'entregado'].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} style={{
                flex: 1,
                background: filterStatus === s ? (s === 'todos' ? '#222' : STATUS_CONFIG[s]?.bg) : 'transparent',
                color: filterStatus === s ? (s === 'todos' ? '#fff' : STATUS_CONFIG[s]?.color) : '#444',
                border: `1px solid ${filterStatus === s ? (s === 'todos' ? '#333' : STATUS_CONFIG[s]?.color) : '#1a1a1a'}`,
                padding: '5px 4px', borderRadius: 4, cursor: 'pointer', fontSize: 9, fontFamily: 'inherit', fontWeight: 600,
              }}>{s.toUpperCase()}</button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
          {visibleOrders.length === 0 && (
            <div style={{ textAlign: 'center', color: '#2a2a2a', fontSize: 12, marginTop: 40 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>Sin órdenes
            </div>
          )}
          {visibleOrders.map(order => {
            const cfg = STATUS_CONFIG[order.status]
            const isActive = activeOrder === order.id
            return (
              <div key={order.id} onClick={() => setActiveOrder(isActive ? null : order.id)}
                style={{ background: isActive ? '#131313' : '#0d0d0d', border: `1px solid ${isActive ? cfg.color : '#1a1a1a'}`, borderRadius: 8, marginBottom: 6, cursor: 'pointer', overflow: 'hidden', transition: 'all 0.15s' }}>
                <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: '#fff', fontFamily: 'inherit' }}>Mesa {order.table_number}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 10, color: '#444' }}>{new Date(order.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div style={{ padding: '0 12px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: cfg.bg, color: cfg.color, padding: '3px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot }} />
                    {cfg.label.toUpperCase()}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b' }}>${order.total.toFixed(2)}</span>
                </div>
                {isActive && (
                  <div style={{ borderTop: '1px solid #1a1a1a' }}>
                    <div style={{ padding: '8px 12px' }}>
                      {order.order_items?.map(item => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#888', padding: '3px 0' }}>
                          <span>{item.product_emoji} {item.product_name} × {item.quantity}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      {order.note && (
                        <div style={{ marginTop: 6, fontSize: 10, color: '#555', fontStyle: 'italic', borderTop: '1px dashed #1a1a1a', paddingTop: 6 }}>📌 {order.note}</div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 4, padding: '8px 12px', borderTop: '1px solid #1a1a1a' }}>
                      {Object.entries(STATUS_CONFIG).map(([key, cfg2]) => (
                        <button key={key} onClick={e => { e.stopPropagation(); handleUpdateStatus(order.id, key) }} style={{
                          flex: 1, background: order.status === key ? cfg2.bg : 'transparent',
                          color: order.status === key ? cfg2.color : '#333',
                          border: `1px solid ${order.status === key ? cfg2.color : '#1f1f1f'}`,
                          padding: '5px 4px', borderRadius: 4, cursor: 'pointer', fontSize: 9, fontFamily: 'inherit', fontWeight: 700,
                        }}>{cfg2.label.toUpperCase()}</button>
                      ))}
                      <button onClick={e => { e.stopPropagation(); deleteOrder(order.id) }} style={{ background: 'transparent', border: '1px solid #2a1a1a', color: '#4a1a1a', padding: '5px 8px', borderRadius: 4, cursor: 'pointer', fontSize: 11, fontFamily: 'inherit' }}>✕</button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #0d0d0d; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 2px; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  )
}