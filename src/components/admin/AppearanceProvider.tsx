'use client'

import { useEffect, type ReactNode } from 'react'
import { useAuth } from '@payloadcms/ui'

type FontSize = 'small' | 'medium' | 'large'
type AppearanceUser = { appearanceFontSize?: FontSize }

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth<AppearanceUser>()

  useEffect(() => {
    const size = user?.appearanceFontSize
    const fontSize: FontSize = size === 'small' || size === 'large' ? size : 'medium'
    document.documentElement.dataset.adminFontSize = fontSize
  }, [user?.appearanceFontSize])

  return children
}
