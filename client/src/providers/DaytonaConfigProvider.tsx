import {
  createContext,
  ReactNode,
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
  const dockerClient = useDockerClient()

  const loadDaytonaConfig = async () => {
    try {
      const result = await dockerClient?.extension.host?.cli.exec('daytona', [
        'config',
        '--format',
        'json',
        '-k',
      ])

      const config = result?.parseJsonObject()

      if (config) {
        setDaytonaConfig(config)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (dockerClient) {
      loadDaytonaConfig()
    }
  }, [dockerClient])

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
