import './globals.css'
import { Inter } from 'next/font/google'
import Header from './components/header'
import Nav from './components/nav'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Tacklebox',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header></Header>
        <main className="p-12 lg:p-24 lg:pt-16 lg:pb-16 bg-cyan-700 mx-auto">
          {children}
        </main>
        <Nav></Nav>
      </body>
    </html>
  )
}
