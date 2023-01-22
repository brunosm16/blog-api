import bcrypt from 'bcrypt'
import { Hasher } from '../../data/protocols/cryptography/hasher'
import { HashComparer } from '../../data/protocols/cryptography/hash-comparer'

export class BcryptAdapter implements Hasher, HashComparer {
  private readonly salt: number

  constructor (salt: number) {
    this.salt = salt
  }

  async hash (value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }

  async compare (password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword)
  }
}
