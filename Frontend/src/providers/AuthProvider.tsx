'use client'

import { createContext, useContext, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation' // 👈 مهم جداً عشان التوجيه
import { User } from '@/types' 
import { getMe } from '@/services/auth' // 👈 تأكد إن logoutService موجودة هنا
import { deleteCookie } from '@/lib/utils'
import { logoutUser } from '@/services'

// 1. تحديث تعريف الأنواع ليشمل logout
type AuthContextType = {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
  isLoginModalOpen: boolean
  openLoginModal: () => void
  closeLoginModal: () => void
  refetchUser: () => Promise<void>
  logout: () => Promise<void> // 👈 ضفناها هنا
}

// 2. تحديث القيمة الافتراضية
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  isLoading: true,
  isLoginModalOpen: false,
  openLoginModal: () => {},
  closeLoginModal: () => {},
  refetchUser: async () => {},
  logout: async () => {}, 
})

export function AuthProvider({ 
  children, 
  isLoggedIn: initialIsLoggedIn 
}: { 
  children: React.ReactNode, 
  isLoggedIn: boolean 
}) {
  const queryClient = useQueryClient()

  // React Query لجلب اليوزر
  const { data: user, isLoading, refetch } = useQuery({
    queryKey: ['current-user'],
    queryFn: getMe,
    retry: false, 
    staleTime: 1000 * 60 * 5,
  })

  // State للمودال
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false) 
  const openLoginModal = () => setIsLoginModalOpen(true)
  const closeLoginModal = () => setIsLoginModalOpen(false)

  const refetchUser = async () => {
    await queryClient.invalidateQueries({ queryKey: ['current-user'] })
    await refetch()
  }

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.log("Server logout error (ignored)");
    } finally {
      
      deleteCookie("token"); 
      queryClient.setQueryData(['current-user'], null);
      
    }
  };

  // تحديد حالة الدخول بناءً على وجود بيانات اليوزر
  const isAuth = !!user 

  return (
    <AuthContext.Provider value={{
      user: user || null,
      isLoggedIn: isAuth, 
      isLoading,
      isLoginModalOpen,
      openLoginModal,
      closeLoginModal,
      logout, // 👈 تمرير الدالة للكونتكس
      refetchUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)