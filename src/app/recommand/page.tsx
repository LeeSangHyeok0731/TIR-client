"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useIntroduce } from "@/hooks/useIntroduce";

type MovieWithTMDB = {
  TITLE: string;
  RATING: number;
  MANRATING: number;
  FEMALERATING: number;
  MANPER: number;
  FEMALEPER: number;
  MANGR: number;
  WOMANGR: number;
  PREFER: "man" | "woman";
  poster?: string;
  tmdbId?: number;
  releaseDate?: string;
  rating?: number;
  voteCount?: number;
  overview?: string;
};

const Recommand = () => {
  const router = useRouter();
  const { data: movies, isLoading, error } = useIntroduce();

  const handleMovieClick = (movieTitle: string) => {
    const encodedTitle = encodeURIComponent(movieTitle);
    router.push(`/recommand/${encodedTitle}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">
          에러가 발생했습니다: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">추천 영화</h1>
          <p className="text-gray-600">
            랜덤하게 선별된 영화들을 확인하고 평점을 남겨보세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {movies?.map((movie, index) => {
            const movieWithTMDB = movie as MovieWithTMDB;
            return (
              <div
                key={index}
                onClick={() => handleMovieClick(movie.TITLE)}
                className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-64">
                  {movieWithTMDB.poster ? (
                    <Image
                      src={movieWithTMDB.poster}
                      alt={movie.TITLE}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-500">포스터 없음</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {movie.TITLE}
                  </h3>

                  {/* TMDB 평점 표시 */}
                  {movieWithTMDB.rating && (
                    <div className="flex items-center mb-2">
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${
                              star <= Math.round(movieWithTMDB.rating! / 2)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {(movieWithTMDB.rating / 2).toFixed(1)}
                      </span>
                    </div>
                  )}

                  {/* 기존 평점 정보 표시 */}
                  <div className="mb-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        전체 평점: {movie.RATING}
                      </span>
                      <span
                        className={`text-sm ${
                          movie.PREFER === "man"
                            ? "text-blue-600"
                            : "text-pink-600"
                        }`}
                      >
                        {movie.PREFER === "man" ? "남성 선호" : "여성 선호"}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>
                        남성: {movie.MANRATING} ({movie.MANPER}%)
                      </span>
                      <span>
                        여성: {movie.FEMALERATING} ({movie.FEMALEPER}%)
                      </span>
                    </div>
                  </div>

                  {/* TMDB 개요 표시 */}
                  {movieWithTMDB.overview && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {movieWithTMDB.overview}
                    </p>
                  )}

                  {/* 개봉일 표시 */}
                  {movieWithTMDB.releaseDate && (
                    <p className="text-xs text-gray-500">
                      개봉일: {movieWithTMDB.releaseDate}
                    </p>
                  )}

                  {/* 투표 수 표시 */}
                  {movieWithTMDB.voteCount && (
                    <p className="text-xs text-gray-500">
                      투표 수: {movieWithTMDB.voteCount.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Recommand;
