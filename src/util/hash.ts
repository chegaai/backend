import argon2 from 'argon2'

// Params as recommended at https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#argon2id
const MEMORY_COST = 15360 // 15 MiB
const TIME_COST = 2
const VARIANT = argon2.argon2id

export function createArgon2Hash(value: string) {
  return argon2.hash(value, { type: VARIANT, timeCost: TIME_COST, memoryCost: MEMORY_COST })
}

export function verifyArgon2Hash(value: string, hash: string) {
  return argon2.verify(hash, value, { type: VARIANT, timeCost: TIME_COST, memoryCost: MEMORY_COST })
}
