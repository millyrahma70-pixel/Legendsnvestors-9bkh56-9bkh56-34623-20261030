import React, { useState } from 'react'

export default function SiteDailyCheckin() {
  const [checked, setChecked] = useState(false)
  
  return (
    <div className="p-6 border rounded-lg bg-card">
      <h3 className="text-lg font-semibold mb-4">Daily Check-in</h3>
      <p className="text-sm text-muted-foreground mb-4">Check in daily to earn rewards</p>
      <button 
        onClick={() => setChecked(true)}
        disabled={checked}
        className="px-4 py-2 bg-primary text-white rounded disabled:bg-gray-300"
      >
        {checked ? 'Checked Today ✓' : 'Check In'}
      </button>
      {checked && <p className="mt-2 text-sm text-green-600">+10 points earned!</p>}
    </div>
  )
}
