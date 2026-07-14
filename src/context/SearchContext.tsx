import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react'

interface SearchContextValue {
  busqueda: string
  setBusqueda: (value: string) => void
}

const SearchContext = createContext<SearchContextValue | null>(null)

export function SearchProvider({ children }: { children: ReactNode }) {
  const [busqueda, setBusqueda] = useState('')

  const value: SearchContextValue = { busqueda, setBusqueda }

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  )
}

export function useSearch(): SearchContextValue {
  const ctx = useContext(SearchContext)
  if (!ctx) {
    throw new Error('useSearch must be used within SearchProvider')
  }
  return ctx
}
