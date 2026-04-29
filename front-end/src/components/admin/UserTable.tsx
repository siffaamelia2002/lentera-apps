"use client";

import { useState, useEffect } from "react";
import { 
  Trash2, Edit3, Plus, Eye, UploadCloud, 
  Loader2, X, Search, ChevronLeft, ChevronRight, Image as ImageIcon
} from "lucide-react";
import SelectModern from "@/components/ui/SelectModern";
import ConfirmModal from "@/components/ui/ConfirmModal";
import ModalCustom from "@/components/ui/ModalCustom";
import { useTableLogic } from "@/hooks/useTableLogic";

interface UserTableProps {
  title: string;
  description: string;
  columns: any[];
  data: any[];
  isLoading?: boolean;
  endpoint: string;
  searchPlaceholder?: string;
  filterOptions?: { label: string; value: string | number }[];
  filterColumn?: string;
  filterPlaceholder?: string;
  showAddButton?: boolean;
  showEditButton?: boolean;
  showDeleteButton?: boolean;
  showDetailButton?: boolean;
  headerActions?: React.ReactNode; 
  customActions?: (item: any) => React.ReactNode;
}

// Fungsi untuk membaca string "a.b.c" menjadi object.a.b.c
const getNestedValue = (obj: any, path: string, fallback: any = "-") => {
  if (!obj || !path) return fallback;
  const value = path.split('.').reduce((acc, part) => acc && acc[part] !== undefined ? acc[part] : undefined, obj);
  return value !== undefined && value !== null && value !== "" ? value : fallback;
};

export default function UserTable({ 
  title, description, columns, data = [], isLoading, endpoint,
  searchPlaceholder = "Cari data...", filterOptions, filterColumn, filterPlaceholder = "Kategori",
  showAddButton = true, showEditButton = true, showDeleteButton = true, showDetailButton = true,
  headerActions, customActions
}: UserTableProps) {
  const { state, setters, mutations, handlers } = useTableLogic(endpoint, data, columns, filterColumn);
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!state.isFormOpen) {
      setPreviewUrl(null);
    } else if (state.modalType === 'EDIT') {
      const fileCol = columns.find(c => c.type === 'file');
      if (fileCol) {
        const fileUrl = getNestedValue(state.formData, fileCol.accessor, null);
        if (fileUrl && fileUrl !== "-") {
          setPreviewUrl(fileUrl);
        }
      }
    }
  }, [state.isFormOpen, state.modalType, state.formData, columns]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldKey: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    const formElement = e.currentTarget;
    const formDataRaw = new FormData(formElement);
    const dataObject: any = {};

    formDataRaw.forEach((value, key) => {
      dataObject[key] = value;
    });

    columns.forEach(c => {
      // 🔥 BACA FORMKEY ATAU ACCESSOR SEBAGAI FALLBACK
      const fieldKey = c.formKey || c.accessor;
      
      if (c.type === 'select' && state.selectValues[fieldKey]) {
        dataObject[fieldKey] = state.selectValues[fieldKey];
      }
      
      if (c.type === 'file') {
        const fileInput = formElement.querySelector(`input[name="${fieldKey}"]`) as HTMLInputElement;
        const file = fileInput?.files?.[0];
        
        if (file) {
          dataObject[fieldKey] = file;
        } else {
          delete dataObject[fieldKey];
        }
      }
    });

    if (state.modalType === 'EDIT') {
      dataObject.id = state.formData.id;
    }

    mutations.submitMutation.mutate(dataObject);
  };

  // 🔥 STATE GABUNGAN UNTUK LOGIKA KONDISIONAL FORM
  const currentFormValues = { ...state.formData, ...state.selectValues };

  // 🔥 FILTER KOLOM FORM BERDASARKAN showCondition
  const formColumns = columns.filter((col: any) => {
    if (!col.type || col.accessor === 'id') return false;
    if (col.showCondition && !col.showCondition(currentFormValues)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight uppercase italic">
            {title.split(' ')[0]} <span className="text-emerald-500">{title.split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1 font-medium">{description}</p>
        </div>
        <div className="flex items-center gap-3">
          {headerActions}
          {showAddButton && (
            <button onClick={handlers.handleAdd} className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3.5 rounded-2xl text-[10px] font-black transition-all shadow-lg shadow-emerald-900/20 uppercase tracking-widest whitespace-nowrap">
              <Plus size={16} strokeWidth={3} /> Tambah Data
            </button>
          )}
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-4 bg-slate-900/30 p-4 rounded-3xl border border-slate-800 items-start">
        <div className="w-full md:w-44 z-20">
          <SelectModern label="Baris" name="entriesPerPage" options={[{ label: "5 Baris", value: "5" }, { label: "10 Baris", value: "10" }, { label: "25 Baris", value: "25" }, { label: "50 Baris", value: "50" }, { label: "Semua Data", value: "1000" }]} selected={String(state.entriesPerPage)} onChange={(val) => setters.setEntriesPerPage(Number(val))} />
        </div>
        <div className="w-full flex-1 z-10 space-y-2">
          <label className="text-slate-500 text-[10px] font-black uppercase ml-1 tracking-widest">Pencarian</label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Search size={18} className="text-slate-500" /></div>
            <input type="text" value={state.searchTerm} onChange={(e) => setters.setSearchTerm(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold text-white focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-500 shadow-inner" placeholder={searchPlaceholder} />
          </div>
        </div>
        {filterOptions && filterColumn && (
          <div className="w-full md:w-56 z-20">
            <SelectModern label={filterPlaceholder} name="filterColumn" options={[{ label: `Semua ${filterPlaceholder}`, value: "" }, ...filterOptions]} selected={state.selectedFilter} onChange={(val) => setters.setSelectedFilter(val)} />
          </div>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden z-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-950/50">
                {columns.filter(c => !c.hidden).map((col) => (
                  <th key={col.accessor} className="px-6 py-5 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">{col.header}</th>
                ))}
                <th className="px-6 py-5 text-center text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {isLoading ? (
                <tr><td colSpan={columns.length + 1} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-emerald-500" size={32} /><p className="text-slate-500 text-xs mt-4 font-bold tracking-widest">MENYIAPKAN DATA...</p></td></tr>
              ) : state.currentData.length > 0 ? (
                state.currentData.map((item: any) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors group">
                    {columns.filter(c => !c.hidden).map((col) => (
                      <td key={col.accessor} className="px-6 py-4 text-sm text-slate-300 font-medium">
                        {col.render ? col.render(item) : getNestedValue(item, col.accessor)}
                      </td>
                    ))}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {showDetailButton && (
                          <button onClick={() => handlers.handleOpenDetail(item)} className="p-2.5 bg-slate-800 text-slate-400 rounded-xl hover:bg-slate-700 hover:text-white transition-all"><Eye size={16} /></button>
                        )}
                        {customActions && customActions(item)}
                        {showEditButton && (
                          <button onClick={() => handlers.handleEdit(item)} className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Edit3 size={16} /></button>
                        )}
                        {showDeleteButton && (
                          <button onClick={() => { setters.setTargetDeleteId(item.id); setters.setIsDeleteModalOpen(true); }} className="p-2.5 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-600 hover:text-white transition-all"><Trash2 size={16} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={columns.length + 1} className="py-20 text-center text-slate-500 text-xs font-bold uppercase italic">Data tidak ditemukan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* PAGINATION */}
        {!isLoading && state.totalProcessed > 0 && (
          <div className="flex items-center justify-between p-5 bg-slate-950/50 border-t border-slate-800">
             <div className="text-xs font-medium text-slate-400">Hal {state.currentPage} / {state.totalPages || 1}</div>
             <div className="flex gap-2">
                <button onClick={() => setters.setCurrentPage((prev: number) => Math.max(1, prev - 1))} className="p-2 bg-slate-900 border border-slate-800 rounded-xl"><ChevronLeft size={16}/></button>
                <button onClick={() => setters.setCurrentPage((prev: number) => Math.min(state.totalPages, prev + 1))} className="p-2 bg-slate-900 border border-slate-800 rounded-xl"><ChevronRight size={16}/></button>
             </div>
          </div>
        )}
      </div>

      {/* --- MODAL FORM TAMBAH & EDIT --- */}
      <ModalCustom 
        isOpen={state.isFormOpen} 
        onClose={() => setters.setIsFormOpen(false)} 
        title={state.modalType === 'TAMBAH' ? `TAMBAH ${title}` : `EDIT ${title}`}
      >
        <form onSubmit={onSubmitForm} className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formColumns.map((col: any) => {
              const isFullWidth = col.type === 'file' || col.type === 'textarea';
              const fieldKey = col.formKey || col.accessor; // 🔥 TERAPKAN FORMKEY
              
              return (
                <div key={fieldKey} className={`space-y-2 ${isFullWidth ? 'md:col-span-2' : ''}`}>
                  <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{col.header}</label>
                  
                  {col.type === 'file' ? (
                    <div className="relative group w-full">
                      <input 
                        type="file" 
                        name={fieldKey} 
                        onChange={(e) => handleFileChange(e, fieldKey)}
                        accept="image/*"
                        className="hidden" 
                        id={`file-${fieldKey}`}
                      />
                      <label 
                        htmlFor={`file-${fieldKey}`} 
                        className={`flex flex-col items-center justify-center w-full border-2 border-dashed border-slate-700 rounded-2xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-500/5 transition-all overflow-hidden ${previewUrl ? 'h-48' : 'h-32'}`}
                      >
                        {previewUrl ? (
                          <div className="relative w-full h-full">
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-contain p-2" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                              <span className="text-white text-xs font-bold flex items-center gap-2"><UploadCloud size={18}/> Ganti Gambar</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-500">
                            <UploadCloud size={28} className="mb-3 group-hover:text-emerald-500 transition-colors" />
                            <p className="text-xs font-medium">Klik untuk mengunggah gambar</p>
                          </div>
                        )}
                      </label>
                    </div>
                  ) : col.type === 'select' ? (
                    <div className="z-50 relative">
                      <SelectModern 
                        label={`Pilih ${col.header}`} 
                        name={fieldKey} 
                        options={col.options || []} 
                        selected={state.selectValues[fieldKey] || getNestedValue(state.formData, col.accessor, "")} 
                        onChange={(val) => setters.setSelectValues((prev: any) => ({ ...prev, [fieldKey]: val }))} 
                      />
                    </div>
                  ) : col.type === 'textarea' ? (
                    <textarea 
                      name={fieldKey} 
                      defaultValue={getNestedValue(state.formData, col.accessor, "")} 
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-600 min-h-[120px] resize-y" 
                      placeholder={`Masukkan ${col.header}...`}
                      required={col.required}
                    />
                  ) : (
                    <input 
                      type={col.type || "text"} 
                      name={fieldKey} 
                      defaultValue={getNestedValue(state.formData, col.accessor, "")} 
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-600" 
                      placeholder={`Masukkan ${col.header}...`}
                      required={col.required}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 pt-6 border-t border-slate-800">
            <button 
              type="button" 
              onClick={() => setters.setIsFormOpen(false)} 
              className="flex-1 py-3.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-black uppercase tracking-widest hover:bg-slate-700 transition-all"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={mutations.submitMutation.isPending} 
              className="flex-1 py-3.5 rounded-xl bg-emerald-600 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {mutations.submitMutation.isPending ? <><Loader2 size={16} className="animate-spin"/> Menyimpan</> : "Simpan Data"}
            </button>
          </div>
        </form>
      </ModalCustom>

      {/* MODAL DETAIL */}
      <ModalCustom isOpen={state.isDetailOpen} onClose={() => setters.setIsDetailOpen(false)} title="INFORMASI LENGKAP">
        {state.selectedItem && (
          <div className="p-8 space-y-6">
            <div className="space-y-4">
              {columns.filter(c => c.type !== 'file' && c.accessor !== 'deskripsi').map(col => (
                <div key={col.accessor}>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{col.header}</p>
                  <p className="text-white font-bold">{col.render ? col.render(state.selectedItem) : getNestedValue(state.selectedItem, col.accessor)}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setters.setIsDetailOpen(false)} className="w-full bg-slate-800 py-4 rounded-xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-slate-700">Tutup Detail</button>
          </div>
        )}
      </ModalCustom>

      {/* MODAL DELETE */}
      <ConfirmModal 
        isOpen={state.isDeleteModalOpen} 
        onClose={() => setters.setIsDeleteModalOpen(false)} 
        onConfirm={() => state.targetDeleteId && mutations.deleteMutation.mutate(state.targetDeleteId)} 
        isLoading={mutations.deleteMutation.isPending}
      />
    </div>
  );
}