import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import axios from 'axios'

import { WorkspaceApi, Configuration } from '../api-client'
import { useDaytonaConfig } from './DaytonaConfigProvider'

const ApiClientContext = createContext<InstanceType<
  typeof WorkspaceApi
> | null>(null)

const axiosInstance = axios.create()

export const ApiClientProvider = ({ children }: { children: ReactNode }) => {
  const [apiClient, setApiClient] = useState<WorkspaceApi | null>(null)
  const daytonaConfig = useDaytonaConfig()

  useEffect(() => {
    if (daytonaConfig) {
      axiosInstance.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${daytonaConfig?.profiles[0].api.key}`

      const api = new WorkspaceApi(
        new Configuration({
          basePath: daytonaConfig?.profiles[0].api.url,
        }),
        undefined,
        axiosInstance,
      )
      setApiClient(api)
    }
  }, [daytonaConfig])

  const value = useMemo(() => {
    return apiClient
  }, [apiClient])

  return (
    <ApiClientContext.Provider value={value}>
      {children}
    </ApiClientContext.Provider>
  )
}

export const useApiClient = () => useContext(ApiClientContext)
