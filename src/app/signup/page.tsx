"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import axiosInstance from "@/utils/axiosInstance";

interface SignupForm {
  email: string;
  password: string;
  passwordCheck: string;
}

const Signup = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
    setError,
  } = useForm<SignupForm>({ mode: "onBlur", reValidateMode: "onChange" });

  const onSubmit = async (data: SignupForm) => {
    if (data.password !== data.passwordCheck) {
      setError("passwordCheck", { message: "비밀번호가 일치하지 않습니다." });
      return;
    }
    try {
      // 실제 회원가입 API 요청
      await axiosInstance.post("/api/register", {
        email: data.email,
        password: data.password,
      });
      toast.success("회원가입이 완료되었습니다!");
      router.push("/");
    } catch (e: unknown) {
      if (
        e &&
        typeof e === "object" &&
        "response" in e &&
        e.response &&
        typeof e.response === "object" &&
        "data" in e.response &&
        e.response.data &&
        typeof e.response.data === "object" &&
        "message" in e.response.data
      ) {
        toast.error((e.response.data as any).message);
      } else if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error("회원가입 실패");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-xs flex flex-col items-center gap-3"
      >
        <div className="mb-1 mt-px pb-[30px]">
          <Image src="/회원가입.png" alt="회원가입" width={130} height={32} />
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
          {errors.email && (
            <div className="text-red-500 text-xs mb-1">
              {errors.email.message}
            </div>
          )}
          <input
            className="w-full h-9 px-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6C7AF2] text-base"
            placeholder="비밀번호"
            type="password"
            autoComplete="new-password"
            {...register("password", {
              required: "비밀번호를 입력하세요.",
              minLength: {
                value: 8,
                message: "비밀번호는 8자리 이상이어야 합니다.",
              },
            })}
          />
          {errors.password && (
            <div className="text-red-500 text-xs mb-1">
              {errors.password.message}
            </div>
          )}
          <input
            className="w-full h-9 px-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6C7AF2] text-base"
            placeholder="비밀번호 확인"
            type="password"
            autoComplete="new-password"
            {...register("passwordCheck", {
              required: "비밀번호 확인을 입력하세요.",
              validate: (val) =>
                val === watch("password") || "비밀번호가 일치하지 않습니다.",
            })}
          />
          {errors.passwordCheck && (
            <div className="text-red-500 text-xs mb-1">
              {errors.passwordCheck.message}
            </div>
          )}
        </div>
        <button
          type="submit"
          className={`w-full h-9 rounded font-semibold text-base shadow-sm transition-colors ${
            isValid
              ? "bg-[#6C7AF2] text-white hover:bg-[#4e5edb]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
          disabled={!isValid || isSubmitting}
        >
          회원가입
        </button>
      </form>
    </div>
  );
};

export default Signup;
