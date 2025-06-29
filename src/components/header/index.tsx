"use client";

import TirLogo from "@/asset/tirLogo";
import { cn } from "@/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type MenuType = {
  title: string;
  path: string;
};

const baseMenuArray = [
  { title: "개요", path: "/introduce" },
  { title: "작품추천 받기", path: "/recommand" },
  { title: "후원하기", path: "/donation" },
];

export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [menuArray, setMenuArray] = useState<MenuType[]>([
    ...baseMenuArray,
    { title: "로그인", path: "/login" },
  ]);

  const handlePath = (path: string) => {
    router.push(path);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      setMenuArray([...baseMenuArray, { title: "프로필", path: "/profile" }]);
    } else {
      setMenuArray([...baseMenuArray, { title: "로그인", path: "/login" }]);
    }
  }, []);

  return (
    <div className="flex py-6 px-44 justify-between items-center w-full h-[88px] border">
      <TirLogo />
      <div className="flex items-center gap-[61px] ">
        {menuArray.map((x: MenuType) => {
          return (
            <div
              key={x.title}
              onClick={() => handlePath(x.path)}
              className={cn(
                "flex py-2.5 px-4 items-center justify-center gap-2.5 cursor-pointer flex-row",
                pathname === x.path
                  ? "bg-[#4E71DB] text-white"
                  : "bg-white text-[#4E71DB]"
              )}
            >
              {x.title}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Header;
