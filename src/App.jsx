import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminView from './pages/AdminView'
import CustomerView from './pages/CustomerView'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminView />} />
        <Route path="/menu" element={<CustomerView />} />
        <Route path="/" element={<AdminView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App