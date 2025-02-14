// src/pages/UserPage.tsx
import React from 'react'
import { useUser } from '../hooks/useUser'

const UserPage: React.FC = () => {
  const { data, error, isLoading } = useUser()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading user</div>

  return (
    <div>
      <h1>User Info</h1>
      <p>ID: {data.id}</p>
      <p>First Name: {data.firstName}</p>
      <p>Last Name: {data.lastName}</p>
    </div>
  )
}

export default UserPage
