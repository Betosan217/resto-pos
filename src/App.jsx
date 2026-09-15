import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import LoginView    from './pages/LoginView'
import AdminView    from './pages/AdminView'
import CustomerView from './pages/CustomerView'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pública */}
        <Route path="/menu"  element={<CustomerView />} />
        <Route path="/login" element={<LoginView />} />

        {/* Privada */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminView />
          </ProtectedRoute>
        } />

        {/* Cualquier otra ruta → menú */}
        <Route path="*" element={<Navigate to="/menu" replace />} />
      </Routes>
    </BrowserRouter>
  )
}