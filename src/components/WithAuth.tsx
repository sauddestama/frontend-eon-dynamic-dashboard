import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/utils/AuthContext";
import { toast } from "react-toastify";

function WithAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  const WithAuthComponent: React.FC<P> = (props) => {
    const { token, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!token) {
        toast.error("Sesi Anda telah berakhir. Silakan login kembali.", {
          position: "top-right",
          autoClose: 3000,
        });
        logout();
        router.push("/auth");
      }
    }, [token, logout, router]);

    if (!token) {
      return null; // atau komponen loading
    }

    return <WrappedComponent {...props} />;
  };

  WithAuthComponent.displayName = `WithAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithAuthComponent;
}

export default WithAuth;
