// C:\next-js-project\EON-Dynamic-Dashboard\frontend\src\app\page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import CSS untuk react-toastify

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if the user is authenticated
    const token = document.cookie.includes("authToken");

    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/auth");
    }
  }, [router]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}
