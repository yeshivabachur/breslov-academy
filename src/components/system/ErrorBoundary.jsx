import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Bug } from 'lucide-react';
import { toast } from 'sonner';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    // In production, log to Sentry or similar
  }

  handleReport = () => {
    toast.success("Error report sent to engineering team.");
    // Simulate logging
    console.log("Report sent:", this.state.error);
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full shadow-xl border-red-100">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              
              <h2 className="text-2xl font-bold mb-2 text-slate-900">Application Error</h2>
              <p className="text-slate-600 mb-8">
                The "No Feature Left Behind" protocol detected an anomaly.
              </p>
              
              <div className="grid gap-3">
                <Button 
                  onClick={() => window.location.reload()} 
                  className="w-full bg-slate-900 hover:bg-slate-800"
                >
                  Reload Application
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline"
                    onClick={() => window.history.back()}
                  >
                    Go Back
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={this.handleReport}
                    className="border-red-200 text-red-700 hover:bg-red-50"
                  >
                    <Bug className="w-4 h-4 mr-2" />
                    Report
                  </Button>
                </div>
              </div>

              {this.state.error && (
                <details className="mt-8 text-left border-t pt-4">
                  <summary className="text-xs font-mono text-slate-400 cursor-pointer hover:text-slate-600">
                    View Stack Trace
                  </summary>
                  <pre className="text-[10px] bg-slate-100 p-3 rounded mt-2 overflow-auto max-h-32 font-mono text-red-800">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
