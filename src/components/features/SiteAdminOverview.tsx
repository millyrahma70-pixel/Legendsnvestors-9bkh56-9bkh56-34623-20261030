import React from 'react'

export default function SiteAdminOverview() {
  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold">Admin Overview</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-4">
          <h3 className="text-sm text-muted-foreground">Total Users</h3>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="text-sm text-muted-foreground">Investments</h3>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="text-sm text-muted-foreground">Revenue</h3>
          <p className="text-2xl font-bold">$0</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="text-sm text-muted-foreground">Active Plans</h3>
          <p className="text-2xl font-bold">0</p>
        </div>
      </div>
    </div>
  )
}
