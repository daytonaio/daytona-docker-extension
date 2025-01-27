import { ModelsResourceStateName } from '../api-client'

export const mapResourceStateToStatus = (
  state: ModelsResourceStateName,
):
  | 'default'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning' => {
  switch (state) {
    case ModelsResourceStateName.ResourceStateNameUndefined:
      return 'default'
    case ModelsResourceStateName.ResourceStateNamePendingRun:
    case ModelsResourceStateName.ResourceStateNamePendingCreate:
    case ModelsResourceStateName.ResourceStateNamePendingStart:
    case ModelsResourceStateName.ResourceStateNamePendingStop:
    case ModelsResourceStateName.ResourceStateNamePendingRestart:
    case ModelsResourceStateName.ResourceStateNamePendingDelete:
    case ModelsResourceStateName.ResourceStateNamePendingForcedDelete:
      return 'primary'
    case ModelsResourceStateName.ResourceStateNameRunning:
    case ModelsResourceStateName.ResourceStateNameStarted:
      return 'success'
    case ModelsResourceStateName.ResourceStateNameRunSuccessful:
      return 'info'
    case ModelsResourceStateName.ResourceStateNameCreating:
    case ModelsResourceStateName.ResourceStateNameStarting:
    case ModelsResourceStateName.ResourceStateNameStopping:
    case ModelsResourceStateName.ResourceStateNameDeleting:
      return 'warning'
    case ModelsResourceStateName.ResourceStateNameStopped:
    case ModelsResourceStateName.ResourceStateNameDeleted:
      return 'secondary'
    case ModelsResourceStateName.ResourceStateNameError:
    case ModelsResourceStateName.ResourceStateNameUnresponsive:
      return 'error'
    default:
      return 'default'
  }
}
