import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Search, RefreshCw, Clock } from 'lucide-react';

export default function AdminSubscriptions() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/subscriptions');
      if (response.ok) {
         const data = await response.json();
         setRequests(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id: string) => {
    if (!confirm("Are you sure you want to approve this subscription?")) return;
    try {
      await fetch(`/api/admin/subscriptions/${id}/approve`, { method: 'POST' });
      fetchRequests();
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Are you sure you want to reject this request?")) return;
    try {
      await fetch(`/api/admin/subscriptions/${id}/reject`, { method: 'POST' });
      fetchRequests();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredRequests = requests.filter(req => 
    req.user_email?.toLowerCase().includes(search.toLowerCase()) ||
    req.shop_id?.includes(search)
  );

  return (
    <div className="min-h-screen bg-[#212121] p-6 lg:p-10 font-sans text-[#f5f5f5]">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#f5f5f5]">Subscription Management</h1>
            <p className="text-[#a0a0a0] mt-1">Review and approve pending Etsy purchases.</p>
          </div>
          <button 
            onClick={fetchRequests} 
            className="flex items-center gap-2 bg-[#2a2a2a] hover:bg-[#333] border border-[#444] px-4 py-2 rounded-lg transition-all"
          >
            <RefreshCw className={`w-4 h-4 text-[#F1641E] ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="bg-[#2a2a2a] border border-[#444] rounded-xl overflow-hidden shadow-xl">
          
          <div className="p-4 border-b border-[#444] flex items-center gap-3 bg-[#1a1a1a]">
            <Search className="w-5 h-5 text-[#888]" />
            <input 
              type="text" 
              placeholder="Search by shop email or ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-[#f5f5f5] w-full placeholder-[#666]"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1a1a1a] text-[#888] text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium border-b border-[#444]">Email / User</th>
                  <th className="px-6 py-4 font-medium border-b border-[#444]">Shop ID</th>
                  <th className="px-6 py-4 font-medium border-b border-[#444]">Plan</th>
                  <th className="px-6 py-4 font-medium border-b border-[#444]">Date</th>
                  <th className="px-6 py-4 font-medium border-b border-[#444]">Status</th>
                  <th className="px-6 py-4 font-medium border-b border-[#444] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#444]">
                {loading && requests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-[#888]">
                      Loading requests...
                    </td>
                  </tr>
                ) : filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-[#888]">
                       <div className="flex flex-col items-center justify-center">
                         <Clock className="w-12 h-12 mb-3 text-[#555]" />
                         <span>No pending subscription requests found.</span>
                       </div>
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((req: any) => (
                    <tr key={req.id} className="hover:bg-[#333] transition-colors group">
                      <td className="px-6 py-4 font-medium text-[#f5f5f5]">{req.user_email}</td>
                      <td className="px-6 py-4 text-[#a0a0a0] font-mono text-sm">{req.shop_id}</td>
                      <td className="px-6 py-4 text-[#F1641E] font-medium">{req.plan_requested}</td>
                      <td className="px-6 py-4 text-[#a0a0a0]">{new Date(req.requested_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                          req.status === 'APPROVED' 
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : req.status === 'REJECTED'
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          <Clock className="w-3 h-3" />
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {req.status === 'PENDING' && (
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleApprove(req.id)} className="p-2 text-green-400 hover:bg-green-400/10 rounded-md transition-colors" title="Approve">
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleReject(req.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-md transition-colors" title="Reject">
                              <XCircle className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
