import { Magic } from '@magic-sdk/admin'
import { NextResponse } from 'next/server'

const mAdmin = new Magic(process.env.MAGIC_SECRET_KEY!)
const BACKEND_URL = process.env.BACKEND_URL || 'https://quantify-backend.vercel.app'

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    // Forward the request to your backend
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'
    const response = await fetch(`${backendUrl}/api/users/auth`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
      },
    })

    if (!response.ok) {
      throw new Error(`Backend responded with status ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Error in /api/user route:', error)
    return NextResponse.json(
      { error: 'Failed to authenticate user' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const didToken = req.headers.get('authorization')?.split('Bearer ')[1]
    if (!didToken) throw new Error('No DID token found')
    
    // Validate token
    await mAdmin.token.validate(didToken)
    const metadata = await mAdmin.users.getMetadataByToken(didToken)
    
    // Get user data from backend
    const response = await fetch(`${BACKEND_URL}/api/users/${metadata.email}`, {
      headers: {
        'Authorization': `Bearer ${didToken}`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch user data')
    }

    const userData = await response.json()
    return NextResponse.json(userData)
    
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 401 })
  }
} 