export type User = {
  id?: string;
  email?: string;
  issuer?: string;
  public_address?: string;
  created_at?: string;
  loading?: boolean;
}

import { createContext, Dispatch, SetStateAction } from 'react'

export const UserContext = createContext<[User | undefined, Dispatch<SetStateAction<User | undefined>>] | undefined>(undefined) 