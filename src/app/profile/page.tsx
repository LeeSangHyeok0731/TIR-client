"use client";

import { useRatings } from "@/hooks/useRatings";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Profile = () => {
  const router = useRouter();
  const { data: ratings, isLoading, error } = useRatings();

  const handleRouting = (movieTitle: string) => {
    router.push(`/recommand/${movieTitle}`);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      router.push("/login");
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">에러가 발생했습니다: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            내 평점 목록
          </h1>
          <p className="text-gray-600 text-lg">
            평가한 영화들을 한눈에 확인해보세요
          </p>
        </div>

        {ratings && ratings.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ratings.map((rating) => (
              <div
                key={rating.ID}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100 cursor-pointer"
                onClick={() => handleRouting(rating.MOVIE_TITLE)}
              >
                {/* 그라데이션 배경 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative p-6">
                  {/* 영화 제목 */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                    {rating.MOVIE_TITLE}
                  </h3>

                  {/* 별점 표시 */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, index) => (
                        <span
                          key={index}
                          className={`text-3xl transition-all duration-300 ${
                            index < rating.RATING
                              ? "text-yellow-400 drop-shadow-sm"
                              : "text-gray-200"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 평점 점수 */}
                  <div className="text-center mb-4">
                    <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-lg font-semibold shadow-md">
                      {rating.RATING}/5
                    </span>
                  </div>

                  {/* 날짜 정보 */}
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">작성일:</span>
                      <span className="text-gray-700">
                        {new Date(rating.CREATED_AT).toLocaleDateString(
                          "ko-KR",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    {rating.UPDATED_AT !== rating.CREATED_AT && (
                      <div className="flex items-center justify-between">
                        <span className="font-medium">수정일:</span>
                        <span className="text-gray-700">
                          {new Date(rating.UPDATED_AT).toLocaleDateString(
                            "ko-KR",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 호버 효과를 위한 장식 요소 */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-500/10 to-purple-500/10 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <span className="text-4xl">🎬</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                아직 평점을 매긴 영화가 없습니다
              </h3>
              <p className="text-gray-600 mb-8">
                영화를 추천받고 평점을 남겨보세요!
              </p>
              <button
                onClick={() => router.push("/recommand")}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                영화 추천받기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
