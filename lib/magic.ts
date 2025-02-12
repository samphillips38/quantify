import { Magic } from 'magic-sdk'

let magic: Magic | null = null

if (typeof window !== 'undefined') {
  magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY!, {
    network: {
      rpcUrl: 'https://mainnet.infura.io/v3/',  // Default fallback RPC URL
      chainId: 1
    }
  })
}

export { magic } 