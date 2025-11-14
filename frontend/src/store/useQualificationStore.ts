import { notification } from "@/lib/utils";
import { getAll } from "@/service/admin/qualification.service";
import { QualificationResponse } from "@/types";
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
        set({ qualifications: res.data?.items || [] });
      } else {
        notification("Không lấy được danh sách quyền!");
      }
    } catch (err) {
      notification("Lỗi khi tải danh sách quyền!");
    } finally {
      set({ loading: false });
    }
  },
}));
