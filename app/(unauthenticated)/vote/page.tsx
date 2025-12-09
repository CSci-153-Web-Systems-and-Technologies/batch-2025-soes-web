'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { verifyVoter } from '@/lib/vote-action' // We will create this server action next
import { Loader2, ArrowRight } from 'lucide-react'

export default function VoterLoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (formData: FormData) => {
    setLoading(true)
    setError('')
    
    const schoolId = formData.get('school_id') as string
    const accessCode = formData.get('access_code') as string

    // Call Server Action
    const result = await verifyVoter(schoolId, accessCode)

    if (result.success) {
      // Redirect to the actual ballot page with the encrypted voter session
      router.push(`/vote/${result.electionId}/ballot`) 
    } else {
      setError(result.message || 'An unknown error occurred.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Student Voting Portal</h1>
          <p className="text-gray-500 text-sm mt-2">Enter your credentials to access the ballot</p>
        </div>

        <form action={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded text-sm text-center border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
            <input 
              name="school_id" 
              type="text" 
              required 
              placeholder="e.g. 2023-12345"
              className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Access Code</label>
            <input 
              name="access_code" 
              type="text" 
              required 
              placeholder="e.g. X7K9P2"
              className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 font-mono tracking-widest uppercase"
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white p-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Access Ballot <ArrowRight size={18} /></>}
          </button>
        </form>
      </div>
    </div>
  )
}