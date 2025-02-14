// src/hooks/useUser.ts
import { useQuery } from '@tanstack/react-query'

const fetchUser = async () => {
  const response = await fetch('http://localhost:3000/api/user')
  if (!response.ok) {
    throw new Error('Error fetching user')
  }
  return response.json()
}

export const useUser = () => {
  return useQuery({ queryKey: ['user'], queryFn: fetchUser })
}
