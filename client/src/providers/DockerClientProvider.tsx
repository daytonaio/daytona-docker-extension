import { createDockerDesktopClient } from '@docker/extension-api-client'
import { createContext, ReactNode, useContext, useMemo } from 'react'

const client = createDockerDesktopClient()
const DockerClientContext = createContext<any>(null)

export const DockerClientProvider = ({ children }: { children: ReactNode }) => {
  const value = useMemo(() => client, [])
  return (
    <DockerClientContext.Provider value={value}>
      {children}
    </DockerClientContext.Provider>
  )
}

export const useDockerClient = () => useContext(DockerClientContext)
