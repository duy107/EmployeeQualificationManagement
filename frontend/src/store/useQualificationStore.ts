import { getAll } from "@/service/admin/qualification.service";
import { QualificationResponse } from "@/types";
import { toast } from "sonner";
import { create } from "zustand";

interface QualificationStore {
  qualifications: QualificationResponse[];
  loading: boolean;
  fetchQualifications: () => Promise<void>;
}

export const useQualificationStore = create<QualificationStore>((set, get) => ({
  qualifications: [],
  loading: false,

  fetchQualifications: async () => {
    if (get().loading) return;
    set({ loading: true });
    try {
      const res = await getAll();
      if (res.status === 200) {
        set({ qualifications: res.data.items || [] });
      } else {
        toast.error("Không lấy được danh sách quyền!");
      }
    } catch (err) {
      toast.error(err as string);
    } finally {
      set({ loading: false });
    }
  },
}));
