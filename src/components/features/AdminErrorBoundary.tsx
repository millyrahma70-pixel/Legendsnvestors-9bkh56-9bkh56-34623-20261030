import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface Props { children: ReactNode }
interface State { failed: boolean }

export default class AdminErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };
  static getDerivedStateFromError(): State { return { failed: true }; }
  componentDidCatch(_error: Error, info: ErrorInfo) {
    console.error('Admin interface failed', info.componentStack);
    toast.error('The admin interface could not load. Please retry.');
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return <main className="min-h-screen bg-background p-6 grid place-items-center"><section className="rounded-2xl border border-border bg-card p-8 max-w-lg space-y-4">
      <ShieldAlert className="text-primary" /><h1 className="text-2xl font-semibold">Admin interface unavailable</h1>
      <p className="text-muted-foreground">Your website records remain saved in the cloud. Retry or return to the shared sign-in page.</p>
      <Button onClick={() => this.setState({ failed: false })}>Retry</Button>
      <Link to="/login" onClick={() => this.setState({ failed: false })} className="flex min-h-11 items-center text-primary hover:opacity-80 focus-visible:outline focus-visible:outline-primary">Return to Sign In</Link>
    </section></main>;
  }
}
