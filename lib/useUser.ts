import { useContext } from 'react'
import { UserContext, User } from './UserContext'

export function useUser(): User | undefined {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserContext.Provider')
  }
  return context[0]
} 