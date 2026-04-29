// @/hooks/use-notify.ts
import { toast } from "sonner";

export const useNotify = () => {
  const success = (title: string, desc?: string) => {
    toast.success(title, { description: desc });
  };

  const error = (title: string, desc?: string) => {
    toast.error(title, { description: desc });
  };

  const info = (title: string, desc?: string) => {
    toast.info(title, { description: desc });
  };

  return { success, error, info };
};