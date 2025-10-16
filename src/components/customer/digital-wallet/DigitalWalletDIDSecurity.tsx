'use client'

import { useState, useEffect } from 'react'
import ZKPGenerator from './ZKPGenerator'

interface DigitalWalletDIDSecurityProps {
  userId: string
}

export default function DigitalWalletDIDSecurity({ userId }: DigitalWalletDIDSecurityProps) {
  return (
    <ZKPGenerator 
      userId={userId}
      onProofGenerated={(proof) => {
        console.log('ZKP Proof generated:', proof)
      }}
      onProofUsed={(proofId) => {
        console.log('ZKP Proof used:', proofId)
      }}
    />
  )
}