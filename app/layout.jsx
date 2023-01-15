'use client';
import { Container } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './globals.css'
import React, { useEffect } from 'react'
import { Magic } from 'magic-sdk';
import { useRouter } from 'next/navigation';
import { useRouter } from 'next/navigation';
const queryClient = new QueryClient()



export default function RootLayout({ children }) {

  const router = useRouter()

  const setUser = userStore(state => state.setUser)
  // const user = userStore(state => state.user)

  useEffect(() => {
    let magic = new Magic(process.env.NEXT_PUBLIC_PUBLISHABLE_KEY);
    magic.user.isLoggedIn().then((isLoggedIn) => {
      if (isLoggedIn) {
        magic.user.getMetadata().then((userData) => setUser(userData.email));
      } else {
        router.push('/user');
        setUser("");
      }
    });
  }, []);

  return (
    <html lang="en">
      <head />
      <QueryClientProvider client={queryClient}>
        <body>
          <Container maxWidth="lg" sx={{ padding: 2 }}>
            {children}
          </Container>
        </body>
      </QueryClientProvider>
    </html>
  )
}
