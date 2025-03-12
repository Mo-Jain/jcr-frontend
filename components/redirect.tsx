"use client";

import { useUserStore } from "@/lib/store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const Redirect = () => {
  const { name } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/" && name) {
      router.push('/');
    }
  }, [name, router, pathname]);
  return null;
};

export default Redirect;
