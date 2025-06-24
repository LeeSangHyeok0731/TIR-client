"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";

type loginType = {
  email: string;
  password: string;
};

const Login = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<loginType>({ mode: "onBlur" });

  const onSubmit = async (data: loginType) => {
    try {
      const response = await axiosInstance.post("/api/login", {
        email: data.email,
        password: data.password,
      });
      const { accessToken } = response.data;
      if (accessToken) {
        Cookies.set("accessToken", accessToken, { path: "/" });
        router.push("/introduce");
      } else {
        throw new Error("토큰이 없습니다.");
      }
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
      ) {
        alert((error.response.data as any).message);
      } else if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("알 수 없는 에러");
      }
    }
  };

  return (
    <div className="w-[100vw] flex justify-center items-center">
      <div className="w-[283px] h-[310px]">
        <Image src="/로그인.png" alt="로그인" width={270} height={40} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="flex flex-col justify-center items-center w-[283px] gap-[5px]">
              <input
                className="flex flex-col justify-center items-center w-[283px] gap-[5px]"
                placeholder="이메일"
                {...register("email", {
                  required: "이메일을 입력하세요.",
                  pattern: {
                    value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                    message: "이메일 형식이 올바르지 않습니다.",
                  },
                })}
              />
            </div>
            <div className="flex flex-col justify-center items-center w-[283px] gap-[5px] border">
              <input
                className="flex flex-col justify-center items-center w-[283px] gap-[5px]"
                placeholder="비밀번호"
                type="password"
                {...register("password", {
                  required: "비밀번호를 입력하세요.",
                  minLength: {
                    value: 8,
                    message: "비밀번호는 8자리 이상이어야 합니다.",
                  },
                })}
              />
            </div>
          </div>
          <button className="flex h-[36px] p-[10px] justify-center items-center gap-[10px] self-stretch">
            로그인
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
