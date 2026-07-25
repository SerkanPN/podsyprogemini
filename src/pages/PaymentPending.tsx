import React, { useState } from 'react';
import { ExternalLink, RefreshCw, AlertCircle, ShoppingBag, CheckCircle2 } from 'lucide-react';

export default function PaymentPending() {
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckStatus = async () => {
    setIsChecking(true);
    try {
      const response = await fetch('/api/payment-pending/status');
      const data = await response.json();
      if (data.status === 'ACTIVE') {
        window.location.href = '/dashboard';
      } else {
        alert("Your payment has not been verified yet. If you just purchased, please wait a few minutes or contact support.");
      }
    } catch (error) {
      console.error(error);
      alert("Error checking status.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#212121] flex items-center justify-center p-4 font-sans text-[#f5f5f5]">
      <div className="max-w-2xl w-full bg-[#2a2a2a] rounded-2xl shadow-2xl border border-[#444] overflow-hidden relative">
        
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#F1641E]"></div>

        <div className="p-8 md:p-12 flex flex-col items-center text-center">
          
          <div className="w-20 h-20 bg-[#F1641E]/10 rounded-full flex items-center justify-center mb-6 border border-[#F1641E]/20">
            <ShoppingBag className="w-10 h-10 text-[#F1641E]" />
          </div>

          <h1 className="text-3xl font-bold mb-4 tracking-tight text-[#f5f5f5]">
            Subscription Required
          </h1>
          
          <p className="text-[#a0a0a0] text-lg mb-8 max-w-lg leading-relaxed">
            To activate your Podsy account, please purchase our official subscription listing on Etsy. 
            Our system will automatically link your purchase.
          </p>

          {/* Instruction Card */}
          <div className="w-full bg-[#212121] rounded-xl border border-[#444] p-6 mb-8 text-left">
            <h3 className="font-semibold flex items-center gap-2 mb-4 text-[#f5f5f5]">
              <AlertCircle className="w-5 h-5 text-[#F1641E]" />
              Important Instruction
            </h3>
            <ul className="space-y-3 text-[#cccccc]">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span>Click the button below to visit our official Etsy listing.</span>
              </li>
              <li className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span><strong className="text-[#f5f5f5]">Crucial:</strong> You MUST use the exact same email address associated with your connected Etsy shop during checkout.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span>Once purchased, return here and click "Check Status".</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[#F1641E] hover:bg-[#D95617] text-white font-semibold rounded-lg transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              Buy on Etsy
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
            
            <button 
              onClick={handleCheckStatus}
              disabled={isChecking}
              className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[#212121] hover:bg-[#333] text-[#f5f5f5] font-semibold rounded-lg border border-[#555] transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${isChecking ? 'animate-spin' : ''}`} />
              {isChecking ? 'Verifying...' : 'I Purchased, Check Status'}
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-[#1a1a1a] p-4 text-center border-t border-[#333]">
          <p className="text-sm text-[#888]">
            If your account is not activated within 5 minutes of purchase, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
