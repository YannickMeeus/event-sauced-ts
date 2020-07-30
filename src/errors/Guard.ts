import { NullableString } from '../types'
import { ArgumentError } from './ArgumentError'

class Guard {
  public static againstNullOrEmpty(paramName: string, value: NullableString): void {
    if (this.isNull(value) || value?.trim().length === 0) {
      throw new ArgumentError(
        `${paramName} can not be null, empty string or contain only whitespace`
      )
    }
  }

  public static againstNull(paramName: string, value: unknown): void {
    if (this.isNull(value)) {
      throw new Error(`${paramName} can not be null`)
    }
  }

  private static isNull(value: unknown | null | undefined) {
    return value === null || value === undefined
  }
}

export { Guard }
