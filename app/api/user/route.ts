import { Magic } from '@magic-sdk/admin'
import { NextResponse } from 'next/server'

// Add logging to check if secret key is present
const MAGIC_SECRET_KEY = process.env.MAGIC_SECRET_KEY
console.log('[API Route] Magic Secret Key present:', !!MAGIC_SECRET_KEY)

if (!MAGIC_SECRET_KEY) {
  throw new Error('MAGIC_SECRET_KEY is not configured')
}

const mAdmin = new Magic(MAGIC_SECRET_KEY)

// Use environment variable for backend URL
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL

// Add logging to see which URL we're using
console.log('[API Route] Using backend URL:', BACKEND_URL)

export async function POST(request: Request) {
  console.log('[API Route] Received POST request')
  
  try {
    const authHeader = request.headers.get('Authorization')
    console.log('[API Route] Auth header present:', !!authHeader)
    console.log('[API Route] Will forward to:', `${BACKEND_URL}/api/users/auth`)
    console.log('[API Route] Environment:', {
      NODE_ENV: process.env.NODE_ENV,
      BACKEND_URL: process.env.NEXT_PUBLIC_API_URL,
    })
    
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    try {
      // Forward the request to the backend
      console.log('[API Route] Attempting fetch to backend...')
      const response = await fetch(`${BACKEND_URL}/api/users/auth`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
      })
      console.log('[API Route] Fetch completed, status:', response.status)

      if (!response.ok) {
        const text = await response.text()
        console.error('[API Route] Backend error:', text)
        return NextResponse.json({ error: text }, { status: response.status })
      }

      const data = await response.json()
      return NextResponse.json(data)

    } catch (fetchError) {
      console.error('[API Route] Fetch error:', fetchError)
      if (fetchError instanceof Error && 'cause' in fetchError) {
        console.error('[API Route] Cause:', fetchError.cause)
      }
      return NextResponse.json(
        { error: 'Failed to connect to backend server' },
        { status: 503 }
      )
    }

  } catch (error) {
    console.error('[API Route] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to authenticate user' },
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