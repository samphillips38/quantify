import { createContext, Dispatch, SetStateAction } from 'react'

export type User = {
  id?: string;
  email?: string;
  issuer?: string;
  public_address?: string;
  created_at?: string;
  loading?: boolean;
}

type UserContextType = [User | undefined, Dispatch<SetStateAction<User | undefined>>]

export const UserContext = createContext<UserContextType | undefined>(undefined) 