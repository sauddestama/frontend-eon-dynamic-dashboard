// src/components/WithAdminAuth.tsx
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/utils/AuthContext";

interface WithAdminAuthProps {
  [key: string]: unknown;
}

function WithAdminAuth<P extends WithAdminAuthProps>(
  WrappedComponent: React.ComponentType<P>
) {
  const WithAdminAuthWrapper: React.FC<P> = (props) => {
    const { roleId } = useAuth();
    const router = useRouter();

    useEffect(() => {
      console.log("WithAdminAuth: Current roleId:", roleId);
      if (roleId !== "66f4ef543336e7123f662bd1") {
        console.log("Redirecting non-admin user to auth page");
        router.push("/auth");
      }
    }, [roleId, router]);

    if (roleId !== "66f4ef543336e7123f662bd1") {
      console.log("Rendering null for non-admin user");
      return null;
    }

    console.log("Rendering admin component");
    return <WrappedComponent {...props} />;
  };

  WithAdminAuthWrapper.displayName = `WithAdminAuth(${getDisplayName(
    WrappedComponent
  )})`;

  return WithAdminAuthWrapper;
}

function getDisplayName<P>(WrappedComponent: React.ComponentType<P>): string {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export default WithAdminAuth;
