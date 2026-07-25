import React, { useState, useEffect } from 'react';
import { Settings, Save, AlertCircle, CheckCircle2, RefreshCw, Package } from 'lucide-react';

export default function Fulfillment() {
  const [providers, setProviders] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [apiKey, setApiKey] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [provRes, ordRes] = await Promise.all([
        fetch('/api/pod-providers'),
        fetch('/api/fulfillment/orders')
      ]);
      if (provRes.ok) setProviders(await provRes.json());
      if (ordRes.ok) setOrders(await ordRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/pod-providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'printify', api_key: apiKey })
      });
      if (res.ok) {
        setApiKey('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 md:p-6 lg:p-8 font-sans text-[#f5f5f5]">
      
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#f5f5f5] flex items-center gap-2">
          <Package className="w-6 h-6 text-[#F1641E]" />
          Fulfillment Orders
        </h1>
        <p className="text-[#a0a0a0] mt-1 text-sm">Manage Print on Demand suppliers and track Etsy orders automatically sent to production.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* API KEY SECTION */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#2a2a2a] border border-[#444] rounded-xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 border-b border-[#444] pb-2">
              <Settings className="w-5 h-5 text-[#F1641E]" />
              Provider Settings
            </h3>
            
            {providers.find(p => p.provider === 'printify' && p.is_active) ? (
              <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-400 text-sm">Printify Active</h4>
                  <p className="text-xs text-[#a0a0a0] mt-1">Your store is connected. Orders will be synced automatically.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveProvider} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#ccc] mb-1">Printify API Key</label>
                  <input
                    type="password"
                    required
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    placeholder="Enter your Printify Personal Access Token"
                    className="w-full bg-[#1a1a1a] border border-[#444] rounded-lg px-3 py-2 text-sm text-[#f5f5f5] focus:outline-none focus:border-[#F1641E]"
                  />
                  <p className="text-xs text-[#888] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    You can generate this in your Printify account settings.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 bg-[#F1641E] hover:bg-[#D95617] text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Printify Key
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ORDERS TABLE */}
        <div className="lg:col-span-2">
          <div className="bg-[#2a2a2a] border border-[#444] rounded-xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-[#444] flex items-center justify-between bg-[#1a1a1a]">
              <h3 className="font-semibold text-[#f5f5f5]">Recent Fulfillment Orders</h3>
              <button onClick={fetchData} className="p-1.5 hover:bg-[#333] rounded-md transition-colors text-[#a0a0a0]">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#1a1a1a] text-[#888] uppercase tracking-wider text-xs">
                    <th className="px-4 py-3 font-medium border-b border-[#444]">Order ID</th>
                    <th className="px-4 py-3 font-medium border-b border-[#444]">Etsy Receipt</th>
                    <th className="px-4 py-3 font-medium border-b border-[#444]">Provider</th>
                    <th className="px-4 py-3 font-medium border-b border-[#444]">Status</th>
                    <th className="px-4 py-3 font-medium border-b border-[#444]">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#444]">
                  {loading && orders.length === 0 ? (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-[#888]">Loading orders...</td></tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-[#888]">
                        <Package className="w-8 h-8 mx-auto mb-2 text-[#555]" />
                        No fulfillment orders found yet.
                      </td>
                    </tr>
                  ) : (
                    orders.map(order => (
                      <tr key={order.id} className="hover:bg-[#333] transition-colors">
                        <td className="px-4 py-3 font-mono text-[#a0a0a0]">{order.provider_order_id || '-'}</td>
                        <td className="px-4 py-3 text-[#f5f5f5]">{order.receipt_id}</td>
                        <td className="px-4 py-3 capitalize text-[#ccc]">{order.pod_providers?.provider || '-'}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${
                            order.status === 'SHIPPED' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                            order.status === 'SENT' || order.status === 'IN_PRODUCTION' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#a0a0a0]">{new Date(order.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
