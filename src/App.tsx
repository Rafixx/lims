// src/App.tsx
import React from 'react'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Outlet />}>
          <Route index element={<HomePage />} />
          <Route path="profile" element={<ProfilePage />} />
          {/* Otras rutas */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
