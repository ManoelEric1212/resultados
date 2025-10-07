import axios from "axios";
// export const production = "http://72.60.149.80:5000";
export const production = "https://mesoluc.shop";
// export const production = "http:10.0.2.2:5000";

const api = axios.create({
  baseURL: production,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
