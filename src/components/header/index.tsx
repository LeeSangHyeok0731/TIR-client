"use client";

import TirLogo from "@/asset/tirLogo";
import { cn } from "@/utils";
import { usePathname, useRouter } from "next/navigation";

type MenuType = {
  title: string;
  path: string;
};

const MenuArray = [
  { title: "개요", path: "/introduce" },
  { title: "작품추천 받기", path: "/recommand" },
  { title: "후원하기", path: "/donation" },
  { title: "로그인", path: "/login" },
];

export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handlePath = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex py-6 px-44 justify-between items-center w-full h-[88px]">
      <TirLogo />
      <div className="flex items-center gap-[61px] ">
        {MenuArray.map((x: MenuType) => {
          return (
            <div
              key={x.title}
              onClick={() => handlePath(x.path)}
              className={cn(
                "flex py-2.5 px-4 items-center justify-center gap-2.5 cursor-pointe flex-row",
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
