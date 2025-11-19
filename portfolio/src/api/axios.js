import axios from "axios";

const api = axios.create({
  baseURL: "http://194.61.28.203:8000/api",
});

export default api;
