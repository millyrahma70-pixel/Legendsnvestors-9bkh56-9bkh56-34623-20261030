import React from 'react'

interface Props { children: React.ReactNode }
interface State { hasError: boolean }

export class PaymentErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(error: any) { console.error('Payment Error:', error) }
  render() {
    if (this.state.hasError) {
      return <div className="p-4 border border-red-200 rounded bg-red-50"><p>Payment module error. Please refresh.</p><button onClick={() => this.setState({ hasError: false })} className="mt-2 px-3 py-1 bg-white border rounded">Retry</button></div>
    }
    return this.props.children
  }
}

export default function PaymentErrorBoundaryWrapper({ children }: Props) {
  return <PaymentErrorBoundary>{children}</PaymentErrorBoundary>
}

// Also export as default for flexible imports
export function PaymentErrorBoundarySimple({ children }: Props) {
  return <>{children}</>
}
