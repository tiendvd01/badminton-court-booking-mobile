import { create } from "zustand";
import { SelectedCell } from "@/components/bookings/BookingSheet";

interface BookingStore {
    selectedCells: SelectedCell[];
    bookingInfo: any;
    bookingDate: string;
    setSelectedCells: (cells: SelectedCell[]) => void;
    setBookingInfo: (info: any) => void;
    setBookingDate: (date: string) => void;
    reset: () => void;
}

const initialState: Partial<BookingStore> = {
    selectedCells: [],
    bookingInfo: {},
    bookingDate: new Date().toISOString().split('T')[0],
}

export const useBookingStore = create<BookingStore>((set) => {
    return {
        selectedCells: [],
        bookingInfo: {},
        bookingDate: new Date().toISOString().split('T')[0],
        setSelectedCells: (cells: SelectedCell[]) => set({ selectedCells: cells }),
        setBookingInfo: (info: any) => set({ bookingInfo: info }),
        setBookingDate: (date: string) => set({ bookingDate: date }),
        reset: () => set(initialState),
    }
})