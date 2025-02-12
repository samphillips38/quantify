import { Magic } from '@magic-sdk/admin'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const mAdmin = new Magic(process.env.MAGIC_SECRET_KEY!)
    return NextResponse.json({ status: 'Magic Admin SDK initialized successfully' })
  } catch (error) {
    console.error('Magic Admin SDK initialization error:', error)
    return NextResponse.json(
      { error: 'Failed to initialize Magic Admin SDK' },
      { status: 500 }
    )
  }
} 