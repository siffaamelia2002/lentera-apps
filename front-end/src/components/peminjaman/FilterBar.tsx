export default function FilterBar({ activeTab, setActiveTab, setSearchQuery }: any) {
  const tabs = ["Semua", "Pending", "Disetujui", "Dipinjam", "Dikembalikan", "Terlambat"];
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#0B1120] p-3 rounded-4xl border border-slate-900">
      <div className="flex p-1 bg-slate-950 rounded-2xl gap-1 overflow-x-auto w-full md:w-auto">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === tab ? "bg-emerald-600 text-white" : "text-slate-500"}`}>
            {tab}
          </button>
        ))}
      </div>
      <input type="text" placeholder="Cari buku..." className="w-full md:w-80 bg-slate-950 border border-slate-800 rounded-2xl px-6 py-3.5 text-xs text-white focus:border-emerald-500 outline-none" 
        onChange={(e) => setSearchQuery(e.target.value)} />
    </div>
  );
}