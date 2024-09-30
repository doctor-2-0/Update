export const BOOK_APPOINTMENT = 'BOOK_APPOINTMENT';
export const SET_SELECTED_DATE = 'SET_SELECTED_DATE';
export const SET_AVAILABLE_SLOTS = 'SET_AVAILABLE_SLOTS';

export type ActionTypes = 
  | { type: typeof BOOK_APPOINTMENT; payload: { doctorId: string; patientId: string; slot: string } }
  | { type: typeof SET_SELECTED_DATE; payload: string | null }
  | { type: typeof SET_AVAILABLE_SLOTS; payload: string[] };

