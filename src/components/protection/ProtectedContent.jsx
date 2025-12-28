import React, { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

export default function ProtectedContent({ 
  children, 
  policy, 
  userEmail, 
  schoolName,
  isEntitled = false,
  showUpgradeCTA = false,
  onUpgradeClick
}) {
  useEffect(() => {
    if (!policy || !policy.protect_content) return;

    const handleContextMenu = (e) => {
      if (policy.block_right_click) {
        e.preventDefault();
      }
    };

    const handleCopy = (e) => {
      if (policy.block_copy) {
        e.preventDefault();
        console.log('Copy blocked by content policy');
      }
    };

    const handleKeyDown = (e) => {
      // Block Ctrl+C, Ctrl+P, Ctrl+S
      if (policy.block_copy && (e.ctrlKey || e.metaKey)) {
        if (e.key === 'c' || e.key === 'C') {
          e.preventDefault();
        }
      }
      if (policy.block_print && (e.ctrlKey || e.metaKey)) {
        if (e.key === 'p' || e.key === 'P') {
          e.preventDefault();
        }
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [policy]);

  if (!policy || !policy.protect_content) {
    return <>{children}</>;
  }

  return (
    <div className="relative" style={{ userSelect: policy.block_copy ? 'none' : 'auto' }}>
      {/* Watermark */}
      {policy.watermark_enabled && isEntitled && (
        <div 
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
          style={{
            opacity: policy.watermark_opacity || 0.18,
            transform: 'rotate(-45deg)'
          }}
          aria-hidden="true"
        >
          <div className="text-slate-600 text-4xl font-bold select-none">
            {userEmail}<br/>
            {schoolName}
          </div>
        </div>
      )}

      {/* Content */}
      <div className={policy.block_copy ? 'select-none' : ''}>
        {children}
      </div>

      {/* Upgrade CTA Overlay */}
      {showUpgradeCTA && !isEntitled && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4 text-center">
            <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Content Protected</h3>
            <p className="text-slate-600 mb-6">
              This content is only available to enrolled students. 
              Purchase access to continue learning.
            </p>
            <button
              onClick={onUpgradeClick}
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-amber-600 hover:to-amber-700"
            >
              Purchase Access
            </button>
          </div>
        </div>
      )}

      {/* Screen reader notice */}
      <div className="sr-only" aria-live="polite">
        {policy.block_copy && 'Content copying is restricted for this material'}
      </div>
    </div>
  );
}