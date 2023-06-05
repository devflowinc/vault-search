import { createSignal } from 'solid-js'
import type { comboboxItem } from './components/Combobox'

export const [selectedComboboxItems, setSelectedComboboxItems] = createSignal<comboboxItem[]>([])
