"use client";

import BlueBTN from "@/asset/bluBTN";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useIntroduce } from "@/hooks/useIntroduce";
import { useEffect, useState, useRef } from "react";

const Introduce = () => {
  const router = useRouter();
  const { data, isLoading, error } = useIntroduce();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handlePath = (path: string) => {
    router.push(path);
  };

  useEffect(() => {
    if (!data || data.length === 0) return;

    // 기존 타이머 정리
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setIsAnimating(true);

      // 애니메이션이 완전히 끝난 후에 포스터 변경
      setTimeout(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === data.length - 1 ? 0 : prevIndex + 1
        );
        setIsAnimating(false);
      }, 500); // 애니메이션 duration과 동일
    }, 3000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [data?.length]);

  if (error) {
    return <div>에러가 발생했습니다: {error.message}</div>;
  }

  return (
    <div>
      <div className="flex relative w-[738px] flex-col justify-center items-start top-[30vh] left-[229px]">
        <div className="mb-7">
          <BlueBTN />
          <div className="mt-2">
            <Image
              src="/오작추.png"
              alt="오늘 볼 작품 추천받는다"
              width={738}
              height={64}
              priority
              unoptimized
            />
          </div>
        </div>
        <div>
          <p className="flex items-start">INFO</p>
          <div className="flex mt-2 w-[738px] justify-between">
            <p className="w-[470px] h-[52px] items-start">
              <Image
                src="/title.png"
                alt="오작추는 오늘의 작품 추천 서비스 소개"
                width={480}
                height={52}
              />
            </p>
            <div className="flex flex-row">
              <button
                className="flex justify-center items-center px p-4 bg-[#4E71DB] text-white"
                onClick={() => handlePath("/login")}
              >
                로그인
              </button>
              <button
                className="flex justify-center items-center px p-4 text-[#4E71DB]"
                onClick={() => handlePath("/signup")}
              >
                회원가입
              </button>
            </div>
          </div>
        </div>
        {isLoading ? (
          <div className="absolute left-[1000px]">
            <div className="mt-8">
              <div className="relative w-[400px] h-[600px] rounded-lg overflow-hidden bg-gray-300"></div>
            </div>
          </div>
        ) : (
          <div className="absolute left-[1000px]">
            <div className="absolute z-10">
              <Image src="/ticket.png" alt="ticket" width={150} height={150} />
            </div>
            {/* 영화 포스터 슬라이더 */}
            {data && data.length > 0 && (
              <div className="mt-8">
                <div className="relative w-[400px] h-[600px] rounded-lg overflow-hidden">
                  {data[currentIndex]?.poster && (
                    <div
                      className={`w-full h-full transition-all duration-500 ease-in-out ${
                        isAnimating
                          ? "scale-95 opacity-0"
                          : "scale-100 opacity-100"
                      }`}
                    >
                      <Image
                        src={data[currentIndex].poster}
                        alt={data[currentIndex].TITLE}
                        width={400}
                        height={600}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                {/* 인디케이터 */}
                <div className="flex justify-center mt-4 space-x-2">
                  {Array.isArray(data) &&
                    data.map((_, index: number) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentIndex
                            ? "bg-blue-500 scale-125"
                            : "bg-gray-300"
                        }`}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Introduce;
