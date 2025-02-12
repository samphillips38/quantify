import { Magic } from 'magic-sdk'

const createMagic = () => {
  if (typeof window === 'undefined') return null
  
  return new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY!, {
    network: {
      chainId: 1,
    }
  })
}

export const magic = createMagic() 