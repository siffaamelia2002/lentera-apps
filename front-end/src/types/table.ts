import { ReactNode } from "react";

export interface Column {
  header: string;
  accessor: string;
  type?: "text" | "select" | "hidden";
  options?: string[];
  render?: (item: any) => ReactNode;
  showIf?: (formData: any) => boolean;
}

export interface UserTableProps {
  title: string;
  description: string;
  columns: Column[];
  data: any[];
  isLoading: boolean;
  endpoint: string;
}