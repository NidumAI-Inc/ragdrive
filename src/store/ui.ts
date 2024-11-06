import { create } from 'zustand';

type state = {
  open: string;
  data: any;
}

type actions = {
  update: (v: Partial<state>) => void
  close: () => void
}

const useUIStore = create<state & actions>()(set => ({
  open: "",
  data: null,

  update: val => set(val),
  close: () => set({ open: "", data: null }),
}))

export default useUIStore;
