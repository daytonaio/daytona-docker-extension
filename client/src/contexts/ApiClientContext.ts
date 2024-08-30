import { createContext } from 'react'
import { WorkspaceApi } from '../api-client'

export const ApiClientContext = createContext<InstanceType<
  typeof WorkspaceApi
> | null>(null)
