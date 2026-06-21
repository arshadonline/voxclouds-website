import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'voxclouds-secret-change-in-prod-32chars!!'
)
const COOKIE = 'vc_token'

export interface Session {
  accountId: number
  number: string
  name: string
  type: number
  deviceUsername?: string
}

export async function createSession(payload: Session) {
  const token = await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(SECRET)
  return token
}

export async function getSession(): Promise<Session | null> {
  try {
    const token = (await cookies()).get(COOKIE)?.value
    if (!token) return null
    const { payload } = await jwtVerify(token, SECRET)
    return payload as unknown as Session
  } catch {
    return null
  }
}

export const COOKIE_NAME = COOKIE
