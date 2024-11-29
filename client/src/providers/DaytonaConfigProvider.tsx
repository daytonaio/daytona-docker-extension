import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useDockerClient } from './DockerClientProvider'

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
  profiles?: IDaytonaConfigProfile[]
}

const DaytonaConfigContext = createContext<{
  daytonaConfig: IDaytonaConfig | null
  loadDaytonaConfig: () => void
}>({
  daytonaConfig: null,
  loadDaytonaConfig: () => {},
})

export const DaytonaConfigProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [daytonaConfig, setDaytonaConfig] = useState<IDaytonaConfig | null>(
    null,
  )
  const dockerClient = useDockerClient()

  const loadDaytonaConfig = useCallback(async () => {
    try {
      let binary = 'get-config.sh'
      if (dockerClient?.host.platform === 'win32') {
        binary = 'get-config.cmd'
      }

      const result = await dockerClient?.extension.host?.cli.exec(binary, [])

      const newConfig = result?.parseJsonObject()

      if (newConfig) {
        setDaytonaConfig((prevConfig) => {
          if (JSON.stringify(newConfig) !== JSON.stringify(prevConfig)) {
            return newConfig
          }
          return prevConfig
        })
      }
    } catch (error: any) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (dockerClient) {
      loadDaytonaConfig()

      interval = setInterval(async () => {
        await loadDaytonaConfig()
      }, 2000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [dockerClient])

  const value = useMemo(() => {
    return {
      daytonaConfig,
      loadDaytonaConfig,
    }
  }, [daytonaConfig])

  return (
    <DaytonaConfigContext.Provider value={value}>
      {children}
    </DaytonaConfigContext.Provider>
  )
}

export const useDaytonaConfig = () => useContext(DaytonaConfigContext)
