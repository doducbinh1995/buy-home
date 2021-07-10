import { configureStore } from "@reduxjs/toolkit";
import TourReducer from "./tour.reducer";

export const store = configureStore({
  reducer: {
    tour: TourReducer,
  },
});
