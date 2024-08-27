import { createContext } from 'react'
import { createDockerDesktopClient } from '@docker/extension-api-client'

export const DockerClientContext = createContext<ReturnType<
  typeof createDockerDesktopClient
> | null>(null)
