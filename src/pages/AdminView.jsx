import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useProducts } from '../hooks/useProducts'
import { FONT_MONO, COLORS } from '../data/constants'
import toast, { Toaster } from 'react-hot-toast'

const EMPTY_FORM = {
  name:        '',
  price:       '',
  description: '',
  category:    '',
  available:   true,
  featured:    false,
  image_url:   '',
}

export default function AdminView() {
  const { signOut } = useAuth()
  const {
    products, loading, error,
    createProduct, updateProduct, deleteProduct, uploadImage,
  } = useProducts()

  const [search, setSearch]             = useState('')
  const [filterCat, setFilterCat]       = useState('Todos')
  const [showForm, setShowForm]         = useState(false)
  const [editingId, setEditingId]       = useState(null)
  const [form, setForm]                 = useState(EMPTY_FORM)
  const [imageFile, setImageFile]       = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [saving, setSaving]             = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.category)))]

  const filtered = products.filter(p => {
    const matchCat    = filterCat === 'Todos' || p.category === filterCat
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  function handleNew() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setImageFile(null)
    setImagePreview(null)
    setShowForm(true)
  }

  function handleEdit(product) {
    setEditingId(product.id)
    setForm({
      name:        product.name,
      price:       product.price,
      description: product.description || '',
      category:    product.category,
      available:   product.available,
      featured:    product.featured,
      image_url:   product.image_url || '',
    })
    setImageFile(null)
    setImagePreview(product.image_url || null)
    setShowForm(true)
  }

  function handleCancel() {
    setShowForm(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
    setImageFile(null)
    setImagePreview(null)
  }

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleSave() {
    if (!form.name || !form.price || !form.category) {
      toast.error('Nombre, precio y categoría son obligatorios')
      return
    }

    setSaving(true)
    const toastId = toast.loading(editingId ? 'Guardando cambios...' : 'Creando producto...')

    try {
      let image_url = form.image_url

      if (imageFile) {
        const { success, url, error } = await uploadImage(imageFile)
        if (!success) throw new Error(error)
        image_url = url
      }

      const payload = {
        name:        form.name.trim(),
        price:       parseFloat(form.price),
        description: form.description.trim() || null,
        category:    form.category.trim(),
        available:   form.available,
        featured:    form.featured,
        image_url:   image_url || null,
      }

      const result = editingId
        ? await updateProduct(editingId, payload)
        : await createProduct(payload)

      if (!result.success) throw new Error(result.error)

      toast.success(editingId ? 'Producto actualizado' : 'Producto creado', { id: toastId })
      handleCancel()
    } catch (err) {
      toast.error(err.message, { id: toastId })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirmDelete) return
    const toastId = toast.loading('Eliminando...')
    const { success, error } = await deleteProduct(confirmDelete.id)
    if (success) {
      toast.success('Producto eliminado', { id: toastId })
    } else {
      toast.error(error, { id: toastId })
    }
    setConfirmDelete(null)
  }

  async function handleToggleAvailable(product) {
    const { success, error } = await updateProduct(product.id, { available: !product.available })
    if (!success) toast.error(error)
  }

  async function handleToggleFeatured(product) {
    const { success, error } = await updateProduct(product.id, { featured: !product.featured })
    if (!success) toast.error(error)
  }

  const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    background: COLORS.surface2,
    border: `1px solid ${COLORS.border2}`,
    color: COLORS.text, padding: '9px 12px',
    borderRadius: 6, fontSize: 12,
    fontFamily: FONT_MONO, outline: 'none',
  }

  const labelStyle = {
    fontSize: 10, color: COLORS.textMuted,
    letterSpacing: 2, marginBottom: 4, display: 'block',
  }

  const badgeStyle = (active, activeColor, activeBg, activeBorder) => ({
    background: active ? activeBg : COLORS.surface2,
    color: active ? activeColor : COLORS.textMuted,
    border: `1px solid ${active ? activeBorder : COLORS.border2}`,
    padding: '4px 10px', borderRadius: 4,
    fontSize: 10, cursor: 'pointer',
    fontFamily: FONT_MONO, fontWeight: 700,
  })

  return (
    <div style={{ fontFamily: FONT_MONO, background: COLORS.bg, minHeight: '100vh', color: COLORS.text }}>
      <Toaster position="top-right" toastOptions={{
        style: {
          background: COLORS.surface, color: COLORS.text,
          border: `1px solid ${COLORS.border2}`,
          fontFamily: FONT_MONO, fontSize: 12,
        }
      }} />

      {/* HEADER */}
      <header style={{
        background: COLORS.surface,
        borderBottom: `1px solid ${COLORS.border}`,
        padding: '0 16px', height: 56,
        display: 'flex', alignItems: 'center', gap: 12,
        position: 'sticky', top: 0, zIndex: 20,
      }}>
        <span style={{ fontSize: 18 }}>🍽</span>
        <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>
          <span style={{ color: COLORS.accent }}>MARY</span>
          <span style={{ color: COLORS.textMuted, fontSize: 10, marginLeft: 6, display: 'none' }}>Admin</span>
        </span>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={handleNew} style={{
            background: COLORS.accent, color: '#000',
            border: 'none', padding: '7px 14px',
            borderRadius: 6, fontSize: 11, fontWeight: 700,
            cursor: 'pointer', fontFamily: FONT_MONO,
            whiteSpace: 'nowrap',
          }}>
            + NUEVO
          </button>
          <button onClick={signOut} style={{
            background: 'transparent',
            border: `1px solid ${COLORS.border2}`,
            color: COLORS.textMuted,
            padding: '7px 12px', borderRadius: 6,
            fontSize: 11, cursor: 'pointer', fontFamily: FONT_MONO,
          }}>
            SALIR
          </button>
        </div>
      </header>

      {/* FILTROS */}
      <div style={{
        padding: '12px 16px',
        borderBottom: `1px solid ${COLORS.border}`,
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        <input
          placeholder="Buscar producto..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={inputStyle}
        />
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilterCat(cat)} style={{
              background: filterCat === cat ? COLORS.accent : COLORS.surface2,
              color: filterCat === cat ? '#000' : COLORS.textDim,
              border: 'none', padding: '6px 14px', borderRadius: 20,
              fontSize: 11, cursor: 'pointer', fontFamily: FONT_MONO,
              fontWeight: filterCat === cat ? 700 : 400,
              whiteSpace: 'nowrap',
            }}>{cat}</button>
          ))}
        </div>
        <div style={{ fontSize: 10, color: COLORS.textMuted }}>
          {filtered.length} producto{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* CONTENIDO */}
      <div style={{ padding: '16px' }}>
        {loading && (
          <div style={{ textAlign: 'center', color: COLORS.textMuted, fontSize: 12, marginTop: 60 }}>
            Cargando productos...
          </div>
        )}
        {error && (
          <div style={{ textAlign: 'center', color: COLORS.danger, fontSize: 12, marginTop: 60 }}>
            Error: {error}
          </div>
        )}

        {/* CARDS — responsivo */}
        {!loading && !error && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 12,
          }}>
            {filtered.map(product => (
              <div key={product.id} style={{
                background: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 10, overflow: 'hidden',
              }}>
                {/* Imagen + info principal */}
                <div style={{ display: 'flex', gap: 12, padding: 12 }}>
                  {product.image_url
                    ? <img src={product.image_url} alt={product.name} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                    : <div style={{ width: 64, height: 64, background: COLORS.surface2, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: COLORS.textMuted, flexShrink: 0 }}>SIN IMG</div>
                  }
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, color: COLORS.text, fontSize: 13, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {product.name}
                    </div>
                    <div style={{ fontSize: 10, color: COLORS.textMuted, marginBottom: 6 }}>
                      {product.category}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.accent }}>
                      Q{parseFloat(product.price).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                {product.description && (
                  <div style={{
                    padding: '0 12px 10px',
                    fontSize: 11, color: COLORS.textMuted,
                    lineHeight: 1.5,
                    borderBottom: `1px solid ${COLORS.border}`,
                  }}>
                    {product.description}
                  </div>
                )}

                {/* Badges + acciones */}
                <div style={{
                  padding: '10px 12px',
                  display: 'flex', alignItems: 'center',
                  gap: 6, flexWrap: 'wrap',
                  borderTop: product.description ? 'none' : `1px solid ${COLORS.border}`,
                }}>
                  <button
                    onClick={() => handleToggleAvailable(product)}
                    style={badgeStyle(product.available, '#34d399', '#0a2e1f', '#34d399')}>
                    {product.available ? 'DISPONIBLE' : 'NO DISPONIBLE'}
                  </button>
                  <button
                    onClick={() => handleToggleFeatured(product)}
                    style={badgeStyle(product.featured, COLORS.accent, COLORS.accentBg, COLORS.accent)}>
                    {product.featured ? 'DESTACADO' : 'NO DESTACADO'}
                  </button>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                    <button onClick={() => handleEdit(product)} style={{
                      background: COLORS.surface2,
                      border: `1px solid ${COLORS.border2}`,
                      color: COLORS.textDim, padding: '5px 12px',
                      borderRadius: 4, fontSize: 10,
                      cursor: 'pointer', fontFamily: FONT_MONO,
                    }}>EDITAR</button>
                    <button onClick={() => setConfirmDelete(product)} style={{
                      background: COLORS.dangerBg,
                      border: `1px solid ${COLORS.danger}33`,
                      color: COLORS.danger, padding: '5px 12px',
                      borderRadius: 4, fontSize: 10,
                      cursor: 'pointer', fontFamily: FONT_MONO,
                    }}>ELIMINAR</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: COLORS.textMuted, fontSize: 12, marginTop: 60 }}>
            No se encontraron productos
          </div>
        )}
      </div>

      {/* MODAL FORMULARIO */}
      {showForm && (
        <div onClick={handleCancel} style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.8)', zIndex: 50,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          animation: 'fadeIn 0.2s ease',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            borderRadius: '16px 16px 0 0',
            width: '100%', maxWidth: 560,
            maxHeight: '92vh', overflowY: 'auto',
            padding: '20px 20px 32px',
          }}>
            {/* Handle */}
            <div style={{ width: 36, height: 4, background: COLORS.border2, borderRadius: 2, margin: '0 auto 20px' }} />

            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 20, color: COLORS.text }}>
              {editingId ? 'EDITAR PRODUCTO' : 'NUEVO PRODUCTO'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Imagen */}
              <div>
                <label style={labelStyle}>IMAGEN</label>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  {imagePreview
                    ? <img src={imagePreview} alt="preview" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }} />
                    : <div style={{ width: 64, height: 64, background: COLORS.surface2, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: COLORS.textMuted }}>SIN IMG</div>
                  }
                  <label style={{
                    background: COLORS.surface2,
                    border: `1px dashed ${COLORS.border2}`,
                    color: COLORS.textDim, padding: '10px 16px',
                    borderRadius: 6, fontSize: 11,
                    cursor: 'pointer', fontFamily: FONT_MONO,
                  }}>
                    {imagePreview ? 'CAMBIAR' : 'SUBIR IMAGEN'}
                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>

              {/* Nombre */}
              <div>
                <label style={labelStyle}>NOMBRE *</label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Ej: Torta de Pierna"
                  style={inputStyle}
                />
              </div>

              {/* Precio y Categoría */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>PRECIO (Q) *</label>
                  <input
                    type="number" min="0" step="0.50"
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="0.00"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>CATEGORÍA *</label>
                  <input
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    placeholder="Ej: Tortas"
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label style={labelStyle}>DESCRIPCIÓN</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Describe el producto..."
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              {/* Checkboxes */}
              <div style={{ display: 'flex', gap: 20 }}>
                {[
                  { key: 'available', label: 'Disponible' },
                  { key: 'featured',  label: 'Destacado'  },
                ].map(({ key, label }) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer', color: COLORS.textDim }}>
                    <input
                      type="checkbox"
                      checked={form[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))}
                      style={{ accentColor: COLORS.accent, width: 14, height: 14 }}
                    />
                    {label}
                  </label>
                ))}
              </div>

              {/* Botones */}
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button onClick={handleCancel} style={{
                  flex: 1, background: 'transparent',
                  border: `1px solid ${COLORS.border2}`,
                  color: COLORS.textMuted, padding: '12px',
                  borderRadius: 6, cursor: 'pointer',
                  fontSize: 12, fontFamily: FONT_MONO,
                }}>CANCELAR</button>
                <button onClick={handleSave} disabled={saving} style={{
                  flex: 2,
                  background: saving ? COLORS.surface2 : COLORS.accent,
                  color: saving ? COLORS.textMuted : '#000',
                  border: 'none', padding: '12px',
                  borderRadius: 6, cursor: saving ? 'default' : 'pointer',
                  fontSize: 12, fontWeight: 700, fontFamily: FONT_MONO,
                  transition: 'all 0.15s',
                }}>
                  {saving ? 'GUARDANDO...' : editingId ? 'GUARDAR CAMBIOS' : 'CREAR PRODUCTO'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAR ELIMINAR */}
      {confirmDelete && (
        <div onClick={() => setConfirmDelete(null)} style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.8)', zIndex: 60,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 16, animation: 'fadeIn 0.2s ease',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: COLORS.surface,
            border: `1px solid ${COLORS.danger}33`,
            borderRadius: 12, padding: 24,
            width: '100%', maxWidth: 340,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>
              ELIMINAR PRODUCTO
            </div>
            <div style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 20, lineHeight: 1.6 }}>
              ¿Eliminar <b style={{ color: COLORS.text }}>{confirmDelete.name}</b>? Esta acción no se puede deshacer.
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setConfirmDelete(null)} style={{
                flex: 1, background: 'transparent',
                border: `1px solid ${COLORS.border2}`,
                color: COLORS.textMuted, padding: '11px',
                borderRadius: 6, cursor: 'pointer',
                fontSize: 12, fontFamily: FONT_MONO,
              }}>CANCELAR</button>
              <button onClick={handleDelete} style={{
                flex: 1, background: COLORS.dangerBg,
                border: `1px solid ${COLORS.danger}`,
                color: COLORS.danger, padding: '11px',
                borderRadius: 6, cursor: 'pointer',
                fontSize: 12, fontWeight: 700, fontFamily: FONT_MONO,
              }}>ELIMINAR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}