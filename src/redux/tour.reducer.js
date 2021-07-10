//@ts-check
import { createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

const initialState = {
  images: [],
};

export const tuor = createSlice({
  name: "counter",
  initialState,
  reducers: {
    updateImages: (state, action) => {
      state.images = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function

export const useGetTour = () => {
  const images = useSelector((state) => state.tour.images);
  return { images };
};

export const useSetTour = () => {
  const dispatch = useDispatch();
  const updateImages = (images) => dispatch(tuor.actions.updateImages(images));
  return { updateImages };
};

export default tuor.reducer;
