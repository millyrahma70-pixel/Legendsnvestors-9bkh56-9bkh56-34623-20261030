import React from 'react'

export default function AdminSignInBrand() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 text-center">
      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
        <span className="text-2xl font-bold text-white">L</span>
      </div>
      <div>
        <h1 className="text-2xl font-bold">Legends Investors</h1>
        <p className="text-sm text-muted-foreground">Admin Portal</p>
      </div>
    </div>
  )
}

export function AdminSignInBrandSimple() {
  return <AdminSignInBrand />
}
