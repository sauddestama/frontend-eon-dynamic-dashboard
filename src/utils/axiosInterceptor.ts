// C:\next-js-project\EON-Dynamic-Dashboard\frontend\src\utils\axiosInterceptor.ts

import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      toast.error("Sesi Anda telah berakhir. Silakan login kembali.", {
        position: "top-right",
        autoClose: 3000,
      });

      // Hapus cookies
      document.cookie =
        "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      document.cookie =
        "userId=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      document.cookie =
        "username=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      document.cookie =
        "roleId=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";

      // Redirect ke halaman login
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
