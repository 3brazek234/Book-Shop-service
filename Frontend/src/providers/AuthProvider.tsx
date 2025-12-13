'use client'

import { createContext, useContext, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { User } from '@/types' 
import { getMe } from '@/services/auth'

type AuthContextType = {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
  isLoginModalOpen: boolean
  openLoginModal: () => void
  closeLoginModal: () => void
  refetchUser: () => void 
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  isLoading: true,
  isLoginModalOpen: false,
  openLoginModal: () => {},
  closeLoginModal: () => {},
  refetchUser: () => {},
})

export function AuthProvider({ 
  children, 
  isLoggedIn: initialIsLoggedIn 
}: { 
  children: React.ReactNode, 
  isLoggedIn: boolean 
}) {
  const queryClient = useQueryClient()
  
  const { data: user, isLoading, refetch } = useQuery({
    queryKey: ['current-user'],
    queryFn: getMe,
    enabled: initialIsLoggedIn, 
    retry: false, 
    staleTime: 1000 * 60 * 5,
  })

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false) 

  const openLoginModal = () => setIsLoginModalOpen(true)
  const closeLoginModal = () => setIsLoginModalOpen(false)

  const refetchUser = async () => {
    await queryClient.invalidateQueries({ queryKey: ['current-user'] })
    await refetch()
  }

  const isAuth = initialIsLoggedIn && !!user

  return (
    <AuthContext.Provider value={{
      user: user || null,
      isLoggedIn: isAuth,
      isLoading,
      isLoginModalOpen,
      openLoginModal,
      closeLoginModal,
      refetchUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)