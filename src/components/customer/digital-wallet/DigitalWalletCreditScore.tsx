'use client'

import { useState, useEffect } from 'react'
import RealCreditScoring from './RealCreditScoring'

interface DigitalWalletCreditScoreProps {
  userId: string
}

export default function DigitalWalletCreditScore({ userId }: DigitalWalletCreditScoreProps) {
  const [credentials, setCredentials] = useState<any[]>([])

  useEffect(() => {
    // Load issued credentials
    const storedCredentials = localStorage.getItem(`issued_credentials_${userId}`)
    if (storedCredentials) {
      const parsedCredentials = JSON.parse(storedCredentials)
      setCredentials(parsedCredentials.filter((cred: any) => cred.status === 'active'))
    }
  }, [userId])

  return (
    <RealCreditScoring 
      userId={userId}
      credentials={credentials}
      onScoreUpdated={(score) => {
        // Save score to localStorage for other components
        localStorage.setItem(`real_time_score_${userId}`, JSON.stringify(score))
      }}
    />
  )
}