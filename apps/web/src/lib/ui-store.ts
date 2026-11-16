'use client'

import { create } from 'zustand'

/** Ephemeral UI state shared across the layout (not persisted). */
interface UiState {
  pickerOpen: boolean
  settingsOpen: boolean
  setPickerOpen: (open: boolean) => void
  setSettingsOpen: (open: boolean) => void
}

export const useUi = create<UiState>()((set) => ({
  pickerOpen: false,
  settingsOpen: false,
  setPickerOpen: (pickerOpen) => set({ pickerOpen }),
  setSettingsOpen: (settingsOpen) => set({ settingsOpen }),
}))
