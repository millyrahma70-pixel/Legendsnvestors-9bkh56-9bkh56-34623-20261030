import React from 'react'

export default function SiteUserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h2 className="font-bold text-lg">Legends Investors</h2>
          <span className="text-sm text-muted-foreground">User Portal</span>
        </div>
      </header>
      <main className="container mx-auto p-4">
        {children}
      </main>
    </div>
  )
}

export function SiteUserLayoutWrapper({ children }: { children: React.ReactNode }) {
  return <SiteUserLayout>{children}</SiteUserLayout>
}
