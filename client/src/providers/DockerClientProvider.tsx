import { createDockerDesktopClient } from '@docker/extension-api-client'
import { createContext, ReactNode, useContext } from 'react'

const client = createDockerDesktopClient()
const DockerClientContext = createContext<ReturnType<
  typeof createDockerDesktopClient
> | null>(null)

export const DockerClientProvider = ({ children }: { children: ReactNode }) => (
  <DockerClientContext.Provider value={client}>
    {children}
  </DockerClientContext.Provider>
)

export const useDockerClient = () => useContext(DockerClientContext)
