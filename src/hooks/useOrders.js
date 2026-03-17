import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  // Cargar órdenes iniciales
  useEffect(() => {
    fetchOrders()

    // Escuchar cambios en tiempo real
    const channel = supabase
      .channel('orders-channel')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders'
      }, () => {
        fetchOrders()
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  async function fetchOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false })

    if (!error) {
      setOrders(data)
    }
    setLoading(false)
  }

  async function placeOrder({ tableNumber, items, note }) {
    const total = items.reduce((s, i) => s + i.price * i.qty, 0)

    // 1. Crear la orden
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({ table_number: tableNumber, total, note, status: 'nuevo' })
      .select()
      .single()

    if (orderError) return { error: orderError.message }

    // 2. Crear los items de la orden
    const orderItems = items.map(i => ({
      order_id: order.id,
      product_id: i.id,
      product_name: i.name,
      product_emoji: i.emoji,
      quantity: i.qty,
      price: i.price,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) return { error: itemsError.message }

    return { success: true }
  }

  async function updateStatus(orderId, status) {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)

    if (error) console.error(error)
  }

  async function deleteOrder(orderId) {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId)

    if (error) console.error(error)
  }

  return { orders, loading, placeOrder, updateStatus, deleteOrder }
}