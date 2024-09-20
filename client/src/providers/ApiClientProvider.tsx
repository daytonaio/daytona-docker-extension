import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import axios from 'axios'

import { WorkspaceApi, Configuration } from '../api-client'
import { useDaytonaConfig } from './DaytonaConfigProvider'

const ApiClientContext = createContext<{
  apiClient: WorkspaceApi | null
  isServerRuning: boolean
}>({
  apiClient: null,
  isServerRuning: false,
})

const axiosInstance = axios.create()

export const ApiClientProvider = ({ children }: { children: ReactNode }) => {
  const [apiClient, setApiClient] = useState<WorkspaceApi | null>(null)
  const daytonaConfig = useDaytonaConfig()
  const [isServerRuning, setIsServerRunning] = useState(false)

  const activeProfileConfig = useMemo(() => {
    if (daytonaConfig) {
      return daytonaConfig.profiles.find(
        (p) => p.name === daytonaConfig.activeProfile,
      )
    }
    return null
  }, [daytonaConfig])

  const checkServer = useCallback(async (url) => {
    try {
      await axiosInstance.get(url)
      setIsServerRunning(true)
    } catch {
      setIsServerRunning(false)
    }
  }, [])

  useEffect(() => {
    if (!activeProfileConfig) {
      return
    }

    checkServer(`${activeProfileConfig?.api.url}/health`)
    const interval = setInterval(async () => {
      await checkServer(`${activeProfileConfig?.api.url}/health`)
    }, 3000)

    return () => clearInterval(interval)
  }, [activeProfileConfig])

  useEffect(() => {
    if (daytonaConfig) {
      if (activeProfileConfig) {
        axiosInstance.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${activeProfileConfig.api.key}`

        const api = new WorkspaceApi(
          new Configuration({
            basePath: activeProfileConfig.api.url,
          }),
          undefined,
          axiosInstance,
        )
        setApiClient(api)
      }
    }
  }, [daytonaConfig, activeProfileConfig])

  const value = useMemo(() => {
    return {
      apiClient,
      isServerRuning,
    }
  }, [apiClient, isServerRuning])

  return (
    <ApiClientContext.Provider value={value}>
      {children}
    </ApiClientContext.Provider>
  )
}

export const useApiClient = () => useContext(ApiClientContext)
