"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
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
        toast.success("로그인에 성공했습니다!");
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
        toast.error((error.response.data as any).message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("알 수 없는 에러가 발생했습니다.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-xs flex flex-col items-center gap-3"
      >
        <div className="mb-1">
          <Image src="/로그인.png" alt="로그인" width={220} height={32} />
        </div>
        <div className="w-full flex flex-col gap-1 mb-1">
          <input
            className="w-full h-9 px-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6C7AF2] text-base"
            placeholder="이메일"
            autoComplete="username"
            {...register("email", {
              required: "이메일을 입력하세요.",
              pattern: {
                value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                message: "이메일 형식이 올바르지 않습니다.",
              },
            })}
          />
          <input
            className="w-full h-9 px-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6C7AF2] text-base"
            placeholder="비밀번호"
            type="password"
            autoComplete="current-password"
            {...register("password", {
              required: "비밀번호를 입력하세요.",
              minLength: {
                value: 8,
                message: "비밀번호는 8자리 이상이어야 합니다.",
              },
            })}
          />
        </div>
        <div className="w-full flex justify-between text-xs text-gray-400 mb-1">
          <button
            type="button"
            className="hover:underline"
            onClick={() => router.push("/signup")}
          >
            회원가입
          </button>
          <span className="select-none">|</span>
          <button
            type="button"
            className="hover:underline"
            onClick={() => toast.info("비밀번호 찾기 기능은 준비 중입니다.")}
          >
            비밀번호 찾기
          </button>
        </div>
        <button
          type="submit"
          className="w-full h-9 bg-[#6C7AF2] text-white rounded font-semibold text-base shadow-sm hover:bg-[#4e5edb] transition-colors"
        >
          로그인
        </button>
      </form>
    </div>
  );
};

export default Login;
