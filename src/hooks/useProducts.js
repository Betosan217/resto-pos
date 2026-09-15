import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useProducts({ onlyAvailable = false } = {}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let query = supabase.from('products').select('*').order('category')
      if (onlyAvailable) query = query.eq('available', true)

      const { data, error } = await query
      if (error) throw error
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [onlyAvailable])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  async function createProduct(payload) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(payload)
        .select()
        .single()
      if (error) throw error
      setProducts(prev => [...prev, data])
      return { success: true, data }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  async function updateProduct(id, payload) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      setProducts(prev => prev.map(p => p.id === id ? data : p))
      return { success: true, data }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  async function deleteProduct(id) {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
      setProducts(prev => prev.filter(p => p.id !== id))
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  async function uploadImage(file) {
    try {
      const ext      = file.name.split('.').pop()
      const fileName = `${Date.now()}.${ext}`
      const { error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file)
      if (error) throw error

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)

      return { success: true, url: data.publicUrl }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  return {
    products, loading, error,
    refetch: fetchProducts,
    createProduct, updateProduct, deleteProduct, uploadImage,
  }
}