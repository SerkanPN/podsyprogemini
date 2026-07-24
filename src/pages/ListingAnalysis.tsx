export default function ListingAnalysis() {
  return (
    <div className="p-6 space-y-6 text-zinc-100">
      <h1 className="text-2xl font-bold">Listing Analizi</h1>
      <div className="flex items-center space-x-4">
        <input type="text" placeholder="Listing ID veya Linki Girin..." className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white" />
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium">Analiz Et</button>
      </div>
    </div>
  );
}