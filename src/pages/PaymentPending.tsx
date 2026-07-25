import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, RefreshCw, Mail, ExternalLink } from "lucide-react";

export default function PaymentPending() {
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const navigate = useNavigate();

  const handleCheckStatus = async () => {
    setLoading(true);
    setStatusMsg("");
    try {
      const res = await fetch("/api/payment-pending/status");
      const data = await res.json();
      
      if (res.ok && data.isApproved) {
        // If approved, redirect to dashboard
        window.location.href = "/dashboard";
      } else {
        setStatusMsg("We haven't detected your order yet. If you just placed it, please wait a few minutes.");
      }
    } catch (err) {
      setStatusMsg("Failed to check status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
            <ShieldAlert className="w-10 h-10 text-indigo-400" />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">Subscription Required</h1>
          
          <p className="text-slate-300 text-lg mb-8">
            Your Podsy account is currently inactive. To unlock all features, please purchase our official subscription listing on Etsy.
          </p>

          <div className="bg-slate-950 rounded-2xl p-6 border border-indigo-500/20 w-full mb-8 text-left">
            <h3 className="text-white font-semibold flex items-center gap-2 mb-3">
              <Mail className="w-5 h-5 text-indigo-400" />
              Important Instruction
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              When placing your order on Etsy, please ensure you use your 
              <strong className="text-white"> Etsy Shop Email Address </strong> 
              (the one you used to connect to Podsy). We will automatically match your order receipt with your account to activate your subscription.
            </p>

            <a 
              href="https://etsy.com/shop/PodsyPro" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              <ExternalLink className="w-5 h-5" />
              Purchase Subscription on Etsy
            </a>
          </div>

          <div className="w-full flex flex-col gap-4">
            <button 
              onClick={handleCheckStatus}
              disabled={loading}
              className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 border border-slate-700"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin text-indigo-400" : "text-slate-400"}`} />
              {loading ? "Checking System..." : "I've Purchased, Check My Status"}
            </button>

            {statusMsg && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-200 text-sm animate-fade-in">
                {statusMsg}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
