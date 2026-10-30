import React from 'react'

export default function SiteAdminHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-white">L</span>
          </div>
          <span className="font-bold">Legends Admin</span>
        </div>
        <div className="text-sm text-muted-foreground">Admin</div>
      </div>
    </header>
  )
}
