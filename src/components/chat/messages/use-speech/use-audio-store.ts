import { create } from 'zustand';

type state = {
  loading: boolean
  botResId: string
  isSpeaking: boolean
  needAutoPlay: boolean
}

type actions = {
  update: (v: Partial<state>) => void
  clear: () => void
}

const useAudioStore = create<state & actions>((set) => ({
  loading: false,
  botResId: "",
  isSpeaking: false,
  needAutoPlay: false,

  update: (payload) => set((state) => ({ ...state, ...payload })),
  clear: () => set({
    loading: false,
    botResId: "",
    isSpeaking: false,
    needAutoPlay: false,
  })
}));

export default useAudioStore;
