import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MapState {
  showMap: boolean;
}

const initialState: MapState = {
  showMap: false,
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setShowMap: (state, action: PayloadAction<boolean>) => {
      state.showMap = action.payload;
    },
  },
});

export const { setShowMap } = mapSlice.actions;
export default mapSlice.reducer;