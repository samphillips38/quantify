import { Magic } from '@magic-sdk/admin'
import { NextResponse } from 'next/server'

const mAdmin = new Magic(process.env.MAGIC_SECRET_KEY!)

export async function POST(req: Request) {
  try {
    const didToken = req.headers.get('authorization')?.split('Bearer ')[1]
    if (!didToken) throw new Error('No DID token found')
    
    await mAdmin.token.validate(didToken)
    return NextResponse.json({ authenticated: true })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
} 