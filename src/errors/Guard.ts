import { NullableString } from '../types'
import { ArgumentMissingError } from './ArgumentMissingError'

class Guard {
  public static againstNullOrEmpty(paramName: string, value: NullableString) {
    if (this.isNull(value) || value!.trim().length === 0) {
      throw new Error(`${paramName} can not be null, empty string or contain only whitespace`)
    }
  }

  public static againstNull(paramName: string, value: any) {
    if (this.isNull(value)) {
      throw new Error(`${paramName} can not be null`)
    }
  }

  private static isNull(value: any | null | undefined) {
    return value === null || value === undefined
  }
}

export { Guard }
