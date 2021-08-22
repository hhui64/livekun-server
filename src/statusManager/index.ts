export interface IStatus {
  isJoinRoom: boolean
  roomInfo: {
    liveId: string
    title: string
  }
  cclinkjs: {
    isReady: boolean
  }
}

const defaultStatus: IStatus = {
  isJoinRoom: false,
  roomInfo: {
    liveId: '',
    title: '',
  },
  cclinkjs: {
    isReady: false,
  },
}

export default class StatusManager {
  public static status = defaultStatus

  public static getStatus(): IStatus {
    return StatusManager.status
  }

  public static setStatus(status: IStatus): void {
    StatusManager.status = status
  }

  public static resetStatus(): void {
    StatusManager.status = defaultStatus
  }
}
