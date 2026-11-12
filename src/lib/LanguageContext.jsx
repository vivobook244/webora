import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { translate } from './translations'

const LanguageContext = createContext(null)
const STORAGE_KEY = 'webora-language'

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved === 'id' || saved === 'en' ? saved : 'id'
    } catch {
      return 'id'
    }
  })

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const setLanguage = (nextLanguage) => {
    if (nextLanguage !== 'id' && nextLanguage !== 'en') return
    setLanguageState(nextLanguage)
    try { localStorage.setItem(STORAGE_KEY, nextLanguage) } catch { /* storage may be unavailable */ }
  }

  const value = useMemo(() => ({
    language,
    setLanguage,
    t: (value) => translate(value, language),
  }), [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}
