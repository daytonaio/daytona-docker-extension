import { createDockerDesktopClient } from '@docker/extension-api-client'
import { v1 } from '@docker/extension-api-client-types'

import { createContext, ReactNode, useContext, useMemo } from 'react'

const client = createDockerDesktopClient()
const DockerClientContext = createContext<v1.DockerDesktopClient | null>(null)

export const DockerClientProvider = ({ children }: { children: ReactNode }) => {
  const value = useMemo(() => client, [])
  return (
    <DockerClientContext.Provider value={value}>
      {children}
    </DockerClientContext.Provider>
  )
}

export const useDockerClient = () => useContext(DockerClientContext)
