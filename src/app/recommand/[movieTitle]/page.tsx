"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { fetchMovieInfo, MovieInfo, submitRating } from "@/api/tmdb";

const MovieRatingPage = () => {
  const params = useParams();
  const router = useRouter();
  const movieTitle = decodeURIComponent(params.movieTitle as string);
  const [movieData, setMovieData] = useState<MovieInfo | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    setIsLoggedIn(!!accessToken);
  }, []);

  useEffect(() => {
    const fetchMovieData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const movieInfo = await fetchMovieInfo(movieTitle);

        if (movieInfo) {
          setMovieData(movieInfo);
        } else {
          setError("영화를 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("영화 데이터를 불러오는데 실패했습니다:", error);
        setError("영화 데이터를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieData();
  }, [movieTitle]);

  const handleRatingSubmit = async () => {
    if (!isLoggedIn) {
      toast.error("로그인이 필요합니다.");
      setTimeout(() => {
        toast.error("로그인 페이지로 이동합니다.");
        router.push("/login");
      }, 1000);
      return;
    }

    if (userRating > 0 && movieData) {
      setIsSubmitting(true);
      setError(null);

      try {
        await submitRating(
          movieData.id.toString(),
          movieData.title,
          userRating
        );
        toast.success("평점이 성공적으로 등록되었습니다!");
      } catch (error) {
        console.error("평점 등록 실패:", error);
        setError(
          error instanceof Error ? error.message : "평점 등록에 실패했습니다."
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleStarClick = (star: number) => {
    if (!isLoggedIn) {
      toast.error("로그인이 필요합니다.");
      setTimeout(() => {
        toast.error("로그인 페이지로 이동합니다.");
        router.push("/login");
      }, 1000);
      return;
    }
    setUserRating(star);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">로딩 중...</div>
      </div>
    );
  }

  if (error || !movieData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">
          {error || "영화를 찾을 수 없습니다."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* 헤더 */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <h1 className="text-3xl font-bold">{movieData.title}</h1>
            <p className="text-blue-100 mt-2">
              {movieData.releaseDate && `개봉일: ${movieData.releaseDate}`}
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 포스터 */}
              <div className="md:col-span-1">
                <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-md">
                  {movieData.poster ? (
                    <Image
                      src={movieData.poster}
                      alt={movieData.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-500">포스터 없음</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 평점 정보 */}
              <div className="md:col-span-2">
                <div className="space-y-6">
                  {/* 전체 평점 */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-3">TMDB 평점</h2>
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl font-bold text-blue-600">
                        {(movieData.rating / 2).toFixed(1)}
                      </div>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-6 h-6 ${
                              star <= Math.round(movieData.rating / 2)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <div className="text-gray-600">
                        ({movieData.voteCount}명 참여)
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      TMDB 원점수: {movieData.rating.toFixed(1)}/10
                    </div>
                  </div>

                  {/* 내 평점 */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-3">내 평점</h2>
                    {!isLoggedIn && (
                      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800 text-sm">
                          평점을 남기려면 로그인이 필요합니다.
                        </p>
                      </div>
                    )}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleStarClick(star)}
                            className={`w-8 h-8 ${
                              star <= userRating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            } hover:text-yellow-400 transition-colors ${
                              !isLoggedIn ? "cursor-not-allowed opacity-50" : ""
                            }`}
                          >
                            <svg viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={handleRatingSubmit}
                        disabled={
                          userRating === 0 || isSubmitting || !isLoggedIn
                        }
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          isLoggedIn
                            ? "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
                            : "bg-gray-400 text-gray-600 cursor-not-allowed"
                        } disabled:cursor-not-allowed`}
                      >
                        {isSubmitting ? "등록 중..." : "평점 등록"}
                      </button>
                    </div>
                    {error && (
                      <div className="mt-2 text-sm text-red-600">{error}</div>
                    )}
                  </div>

                  {/* 영화 설명 */}
                  {movieData.overview && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h2 className="text-xl font-semibold mb-3">영화 소개</h2>
                      <p className="text-gray-700 leading-relaxed">
                        {movieData.overview}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieRatingPage;
