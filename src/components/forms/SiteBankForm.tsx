import React, { useState } from 'react'

export default function SiteBankForm() {
  const [bank, setBank] = useState({ accountName: '', accountNumber: '', bankName: '' })
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Bank saved', bank)
    alert('Bank account saved!')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg max-w-md">
      <h3 className="font-semibold">Add Bank Account</h3>
      <input className="w-full border rounded p-2" placeholder="Bank Name" value={bank.bankName} onChange={e => setBank({...bank, bankName: e.target.value})} />
      <input className="w-full border rounded p-2" placeholder="Account Name" value={bank.accountName} onChange={e => setBank({...bank, accountName: e.target.value})} />
      <input className="w-full border rounded p-2" placeholder="Account Number" value={bank.accountNumber} onChange={e => setBank({...bank, accountNumber: e.target.value})} />
      <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Save Bank</button>
    </form>
  )
}
