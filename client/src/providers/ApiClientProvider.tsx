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

import {
  WorkspaceApi,
  Configuration,
  TargetApi,
  GitProviderApi,
  SampleApi,
} from '../api-client'
import { useDaytonaConfig } from './DaytonaConfigProvider'

const ApiClientContext = createContext<{
  workspaceApiClient: WorkspaceApi | null
  targetApiClient: TargetApi | null
  sampleApiClient: SampleApi | null
  gitProvidersApiClient: GitProviderApi | null
  isServerRuning: boolean
}>({
  workspaceApiClient: null,
  targetApiClient: null,
  sampleApiClient: null,
  isServerRuning: false,
  gitProvidersApiClient: null,
})

const axiosInstance = axios.create()

export const ApiClientProvider = ({ children }: { children: ReactNode }) => {
  const [workspaceApiClient, setWorkspaceApiClient] =
    useState<WorkspaceApi | null>(null)
  const [targetApiClient, setTargetApiClient] = useState<TargetApi | null>(null)
  const [gitProvidersApiClient, setGitProvidersApiClient] =
    useState<GitProviderApi | null>(null)
  const [sampleApiClient, setSampleApiClient] = useState<SampleApi | null>(null)
  const { daytonaConfig } = useDaytonaConfig()
  const [isServerRuning, setIsServerRunning] = useState(false)

  const activeProfileConfig = useMemo(() => {
    if (daytonaConfig) {
      return daytonaConfig.profiles?.find(
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
    if (activeProfileConfig) {
      axiosInstance.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${activeProfileConfig.api.key}`

      const config = new Configuration({
        basePath: activeProfileConfig.api.url,
      })

      const workspaceApi = new WorkspaceApi(config, undefined, axiosInstance)
      setWorkspaceApiClient(workspaceApi)

      const targetApi = new TargetApi(config, undefined, axiosInstance)
      setTargetApiClient(targetApi)

      const sampleApi = new SampleApi(config, undefined, axiosInstance)
      setSampleApiClient(sampleApi)

      const gitProvidersApi = new GitProviderApi(
        config,
        undefined,
        axiosInstance,
      )
      setGitProvidersApiClient(gitProvidersApi)
    }
  }, [activeProfileConfig])

  const value = useMemo(() => {
    return {
      workspaceApiClient,
      targetApiClient,
      sampleApiClient,
      gitProvidersApiClient,
      isServerRuning,
    }
  }, [
    workspaceApiClient,
    targetApiClient,
    sampleApiClient,
    isServerRuning,
    gitProvidersApiClient,
  ])

  return (
    <ApiClientContext.Provider value={value}>
      {children}
    </ApiClientContext.Provider>
  )
}

export const useApiClient = () => useContext(ApiClientContext)
