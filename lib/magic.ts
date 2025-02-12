import { Magic } from 'magic-sdk'

const createMagic = () => {
  if (typeof window !== 'undefined') {
    return new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY!, {
      network: {
        rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'https://mainnet.infura.io/v3/',
        chainId: 1,
      },
      loadingScreen: {
        // Disable preloading of UI assets
        preload: false
      }
    })
  }
}

export const magic = createMagic()! 