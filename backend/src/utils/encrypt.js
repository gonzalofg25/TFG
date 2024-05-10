import bcrypt from 'bcrypt'

export async function encryptPassword(password){
  return await bcrypt.hash(password, 10)
}

export async function checkHash(text, hash){
  return await bcrypt.compareSync(text, hash)
}