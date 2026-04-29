"use client";

import { useState, useMemo, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner"; 
import api from "@/libs/api-client";
import { Column } from "@/types/table"; 
import { useRouter } from "next/navigation";

export function useTableLogic(endpoint: string, data: any, columns: Column[], filterColumn?: string) {
  const queryClient = useQueryClient();
  const router = useRouter(); 

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  
  // Data States
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalType, setModalType] = useState<"TAMBAH" | "EDIT">("TAMBAH");
  const [targetDeleteId, setTargetDeleteId] = useState<number | null>(null);
  
  // Form States
  const [formData, setFormData] = useState<any>({});
  const [selectValues, setSelectValues] = useState<Record<string, string>>({});
  const [manualInputs, setManualInputs] = useState<Record<string, boolean>>({});
  
  // Table, Search, Filter & Pagination States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(1000); 
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedFilter, entriesPerPage]);

  // LOGIKA PEMROSESAN DATA
  const processedData = useMemo(() => {
    let rawData: any[] = [];
    if (Array.isArray(data)) {
      rawData = data;
    } else if (data && Array.isArray(data.data)) {
      rawData = data.data; 
    }

    let result = [...rawData];

    if (filterColumn && selectedFilter) {
      result = result.filter((item: any) => String(item[filterColumn]) === String(selectedFilter));
    }

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter((item: any) => {
        return columns.some(col => {
          if (col.type !== 'file' && item[col.accessor] !== null && item[col.accessor] !== undefined) {
            return String(item[col.accessor]).toLowerCase().includes(lowerSearch);
          }
          return false;
        });
      });
    }

    return result;
  }, [data, searchTerm, selectedFilter, filterColumn, columns]);

  const totalPages = Math.ceil(processedData.length / entriesPerPage) || 1;
  const totalProcessed = processedData.length;
  
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return processedData.slice(start, start + entriesPerPage);
  }, [processedData, currentPage, entriesPerPage]);

  // ==================== HELPER: CONVERT TO FORM DATA ====================
  const convertToFormData = (payload: any, method: string = "POST") => {
    const fd = new FormData();
    Object.keys(payload).forEach((key) => {
      const value = payload[key];
      // Skip null/undefined
      if (value === null || value === undefined) return;
      
      // Jangan masukkan id ke body FormData jika tidak perlu (opsional, tapi aman)
      if (key === 'id') return;
      
      if (value instanceof File || value instanceof Blob) {
        fd.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((v) => fd.append(`${key}[]`, v));
      } else if (typeof value === "object") {
        fd.append(key, JSON.stringify(value));
      } else {
        fd.append(key, value);
      }
    });

    if (method === "PUT") {
      fd.append("_method", "PUT");
    }
    return fd;
  };

  // ==================== MUTATIONS ====================

  const submitMutation = useMutation({
    mutationFn: async (payload: any) => {
      // 1. Cek apakah di dalam object payload ada data File
      const hasFile = Object.values(payload).some(
        (val) => val instanceof File || val instanceof Blob
      );

      // Mode EDIT
      if (modalType === "EDIT") {
        const id = payload.id || formData.id;
        
        if (hasFile) {
          // WAJIB POST + METHOD SPOOFING buat Laravel
          const finalPayload = convertToFormData(payload, "PUT");
          return api.post(`${endpoint}/${id}`, finalPayload, {
            headers: { "Content-Type": "multipart/form-data" }
          });
        }
        
        // Kalau ga ada file (cuma ganti text), PUT JSON biasa biar ringan & cepat
        return api.put(`${endpoint}/${id}`, payload);
      }

      // Mode TAMBAH
      if (hasFile) {
        const finalPayload = convertToFormData(payload, "POST");
        return api.post(endpoint, finalPayload, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }
      
      return api.post(endpoint, payload);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      router.refresh(); 
      toast.success(res.data?.message || (modalType === "TAMBAH" ? "Data berhasil ditambah" : "Data berhasil diperbarui"));
      setIsFormOpen(false);
      setFormData({});
    },
    onError: (err: any) => {
      console.error("Submit Error Detail:", err.response?.data);
      const errors = err.response?.data?.errors;
      let errorMsg = err.response?.data?.message || "Terjadi kesalahan";
      
      if (errors) {
        errorMsg = Object.values(errors).flat().join(", ");
      }
      toast.error(errorMsg);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number | string) => api.delete(`${endpoint}/${id}`),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      router.refresh(); 
      toast.success(res.data?.message || "Data berhasil dihapus");
      setIsDeleteModalOpen(false);
      setTargetDeleteId(null);
      setSelectedRows(prev => prev.filter(rowId => rowId !== targetDeleteId));
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Gagal menghapus data");
    }
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: number[]) => api.post(`${endpoint}/bulk-delete`, { ids }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      router.refresh(); 
      toast.success(res.data?.message || `${selectedRows.length} Data berhasil dihapus`);
      setIsBulkDeleteModalOpen(false);
      setSelectedRows([]);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Gagal menghapus masal");
    }
  });

  // ==================== HANDLERS ====================

  const handleAdd = () => {
    setModalType("TAMBAH");
    setFormData({});
    setSelectValues({});
    setManualInputs({});
    setIsFormOpen(true);
  };

  const handleEdit = (item: any) => {
    setModalType("EDIT");
    setFormData(item);
    
    const initialSelects: Record<string, string> = {};
    const initialManuals: Record<string, boolean> = {};
    
    columns.forEach(col => {
      if (col.type === 'select') {
        const val = item?.[col.accessor];
        initialSelects[col.accessor] = typeof val === 'object' && val !== null ? (val.id || val.value || "") : (val || "");
        initialManuals[col.accessor] = !col.options || col.options.length === 0;
      }
    });

    setSelectValues(initialSelects);
    setManualInputs(initialManuals);
    setIsFormOpen(true);
  };

  const handleOpenDetail = (item: any) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  const handleSelectAll = () => {
    if (selectedRows.length === currentData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentData.map(i => i.id));
    }
  };

  const handleSelectRow = (id: number) => {
    setSelectedRows(prev => prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]);
  };

  return {
    state: {
      isFormOpen, isDetailOpen, isDeleteModalOpen, isBulkDeleteModalOpen,
      selectedItem, modalType, targetDeleteId, formData, selectValues, manualInputs,
      currentPage, entriesPerPage, selectedRows, totalPages, currentData,
      searchTerm, selectedFilter, totalProcessed
    },
    setters: {
      setIsFormOpen, setIsDetailOpen, setIsDeleteModalOpen, setIsBulkDeleteModalOpen,
      setSelectedItem, setModalType, setTargetDeleteId, setFormData, setSelectValues,
      setManualInputs, setCurrentPage, setEntriesPerPage, setSelectedRows,
      setSearchTerm, setSelectedFilter
    },
    mutations: { submitMutation, deleteMutation, bulkDeleteMutation },
    handlers: { handleAdd, handleEdit, handleOpenDetail, handleSelectAll, handleSelectRow }
  };
}