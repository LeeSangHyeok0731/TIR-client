"use client";

import { useRatings } from "@/hooks/useRatings";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Profile = () => {
  const router = useRouter();
  const { data: ratings, isLoading, error } = useRatings();

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            내 평점 목록
          </h1>

          {ratings && ratings.length > 0 ? (
            <div className="space-y-4">
              {ratings.map((rating) => (
                <div
                  key={rating.ID}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {rating.MOVIE_TITLE}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>평점: {rating.RATING}/5</span>
                        <span>
                          작성일:{" "}
                          {new Date(rating.CREATED_AT).toLocaleDateString(
                            "ko-KR"
                          )}
                        </span>
                        {rating.UPDATED_AT !== rating.CREATED_AT && (
                          <span>
                            수정일:{" "}
                            {new Date(rating.UPDATED_AT).toLocaleDateString(
                              "ko-KR"
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {[...Array(5)].map((_, index) => (
                        <span
                          key={index}
                          className={`text-2xl ${
                            index < rating.RATING
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">
                아직 평점을 매긴 영화가 없습니다.
              </div>
              <button
                onClick={() => router.push("/recommand")}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                영화 추천받기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
