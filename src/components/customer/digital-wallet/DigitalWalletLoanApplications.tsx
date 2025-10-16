'use client'

import { useState, useEffect } from 'react'
import LoanMarketplace from './LoanMarketplace'

interface DigitalWalletLoanApplicationsProps {
  userId: string
}

export default function DigitalWalletLoanApplications({ userId }: DigitalWalletLoanApplicationsProps) {
  const [zkpProofs, setZkpProofs] = useState<any[]>([])
  const [userScore, setUserScore] = useState(680)

  useEffect(() => {
    // Load ZKP proofs
    const storedProofs = localStorage.getItem(`zkp_proofs_${userId}`)
    if (storedProofs) {
      const parsedProofs = JSON.parse(storedProofs)
      setZkpProofs(parsedProofs.filter((proof: any) => {
        const now = new Date()
        const expiresAt = new Date(proof.expiresAt)
        return expiresAt > now && proof.status !== 'revoked'
      }))
    }

    // Load user score
    const storedScore = localStorage.getItem(`real_time_score_${userId}`)
    if (storedScore) {
      const scoreData = JSON.parse(storedScore)
      setUserScore(scoreData.finalScore || 680)
    }
  }, [userId])

  return (
    <LoanMarketplace 
      userId={userId}
      userScore={userScore}
      zkpProofs={zkpProofs}
      onApplicationCreated={(application) => {
        console.log('Application created:', application)
      }}
      onApplicationUpdated={(application) => {
        console.log('Application updated:', application)
      }}
    />
  )
}