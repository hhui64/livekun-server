import consola from 'consola'
import fs from 'fs'
import path from 'path'

const log = consola.withTag('configmanager')

export interface IUserConfig {
  uuid: string
  giftCapsule: {
    level: Array<number>
    duration: Array<number>
    maximum: number
    minMoney: number
  }
  chatMessage: {
    style: {
      fontSize: number
    }
    show: {
      join: boolean
      follow: boolean
      gift: boolean
    }
    blacklist: Array<string>
  }
  giftCard: {
    level: Array<number>
    minMoney: number
    comment: {
      use: boolean
      prefix: string
      giftMinMoney: number
      giftWhitelist: string
    }
  }
}

const defaultUserConfig: Omit<IUserConfig, 'uuid'> = {
  giftCapsule: {
    level: [0, 99, 199],
    duration: [5, 15, 30],
    maximum: 10,
    minMoney: 0.01,
  },
  chatMessage: {
    style: {
      fontSize: 16,
    },
    show: {
      join: false,
      follow: false,
      gift: true,
    },
    blacklist: [],
  },
  giftCard: {
    level: [0, 49, 99],
    minMoney: 0.01,
    comment: {
      use: false,
      prefix: '留言：',
      giftMinMoney: 0.01,
      giftWhitelist: '',
    },
  },
}

class UserConfig implements IUserConfig {
  uuid: string
  giftCapsule: {
    level: number[]
    duration: number[]
    maximum: number
    minMoney: number
  }
  chatMessage: {
    style: {
      fontSize: number
    }
    show: {
      join: boolean
      follow: boolean
      gift: boolean
    }
    blacklist: string[]
  }
  giftCard: {
    level: number[]
    minMoney: number
    comment: {
      use: boolean
      prefix: string
      giftMinMoney: number
      giftWhitelist: string
    }
  }

  constructor(uuid: string) {
    this.uuid = uuid
    this.giftCapsule = defaultUserConfig.giftCapsule
    this.chatMessage = defaultUserConfig.chatMessage
    this.giftCard = defaultUserConfig.giftCard

    try {
      this.read()
    } catch (error) {
      this.reset()
    }
  }

  getFilePath(): string {
    return path.join(__dirname, '../../', 'config', `${this.uuid}.json`)
  }

  read(): this {
    const configData = JSON.parse(fs.readFileSync(this.getFilePath()).toString()) as IUserConfig
    this.giftCapsule = configData.giftCapsule
    this.chatMessage = configData.chatMessage
    this.giftCard = configData.giftCard
    return this
  }

  save(): this {
    try {
      fs.writeFileSync(this.getFilePath(), JSON.stringify(this, null, 2))
    } catch (error) {
      log.error(error)
    }
    return this
  }

  reset(): this {
    this.giftCapsule = defaultUserConfig.giftCapsule
    this.chatMessage = defaultUserConfig.chatMessage
    this.giftCard = defaultUserConfig.giftCard
    return this
  }

  setGiftCapsule(config: IUserConfig['giftCapsule']) {
    this.giftCapsule = config
  }

  setChatMessage(config: IUserConfig['chatMessage']) {
    this.chatMessage = config
  }

  setGiftCard(config: IUserConfig['giftCard']) {
    this.giftCard = config
  }

  update(config: IUserConfig): this {
    this.giftCapsule = config.giftCapsule
    this.chatMessage = config.chatMessage
    this.giftCard = config.giftCard
    return this
  }
}

export default class UserConfigManager {
  public static get(uuid: string): UserConfig {
    return new UserConfig(uuid)
  }
}
