'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export function DatabaseTest() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testDatabase = async () => {
    setLoading(true)
    try {
      console.log('Testing database connection...')
      
      // Test 1: Check if users table exists
      const { data: tableData, error: tableError } = await supabase
        .from('users')
        .select('*')
        .limit(1)
      
      console.log('Table test result:', { tableData, tableError })
      
      // Test 2: Try to insert a test record
      const testUser = {
        id: 'test-user-' + Date.now(),
        email: 'test@example.com',
        full_name: 'Test User',
        role: 'customer',
        is_verified: true,
        last_login: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      const { data: insertData, error: insertError } = await supabase
        .from('users')
        .insert(testUser)
        .select()
        .single()
      
      console.log('Insert test result:', { insertData, insertError })
      
      // Test 3: Clean up test record
      if (insertData) {
        await supabase
          .from('users')
          .delete()
          .eq('id', testUser.id)
      }
      
      setResult({
        tableTest: { data: tableData, error: tableError },
        insertTest: { data: insertData, error: insertError },
        cleanup: insertData ? 'success' : 'skipped'
      })
      
    } catch (error) {
      console.error('Database test error:', error)
      setResult({ error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 bg-yellow-100 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Database Test</h3>
      <button 
        onClick={testDatabase}
        disabled={loading}
        className="bg-yellow-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Database Connection'}
      </button>
      
      {result && (
        <div className="mt-4">
          <h4 className="font-bold">Test Results:</h4>
          <pre className="bg-gray-200 p-2 rounded text-xs overflow-auto max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}


