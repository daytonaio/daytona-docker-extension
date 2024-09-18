import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

interface IDaytonaConfigProfile {
  id: string
  name: string
  api: {
    url: string
    key: string
  }
}

interface IDaytonaConfig {
  id: string
  activeProfile: string
  defaultIde: string
  profiles: IDaytonaConfigProfile[]
}

const DaytonaConfigContext = createContext<IDaytonaConfig | null>(null)

export const DaytonaConfigProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [daytonaConfig, setDaytonaConfig] = useState<IDaytonaConfig | null>(
    null,
  )

  useEffect(() => {
    setTimeout(() => {
      setDaytonaConfig({
        id: 'daytona',
        activeProfile: 'default',
        defaultIde: 'vscode',
        profiles: [
          {
            id: 'default',
            name: 'Default',
            api: {
              url: 'http://localhost:3986',
              key: 'ODk4MTI1YjItYjRhNi00NjUwLTgwODYtZWZlZjhiNzA3ZDVk',
            },
          },
        ],
      })
    }, 2000)
  }, [])

  const value = useMemo(() => {
    return daytonaConfig
  }, [daytonaConfig])

  return (
    <DaytonaConfigContext.Provider value={value}>
      {children}
    </DaytonaConfigContext.Provider>
  )
}

export const useDaytonaConfig = () => useContext(DaytonaConfigContext)
