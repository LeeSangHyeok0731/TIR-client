"use client";

import { useEffect, useState } from "react";
import { fetchMovieInfo, MovieInfo } from "@/api/tmdb";
import { FaMars, FaVenus } from "react-icons/fa";
import { useRouter } from "next/navigation";

// 추천 결과 아이템 타입 정의
interface RecommendItem {
  TITLE?: string;
  title?: string;
  genres?: string[];
  PREFER?: "man" | "woman";
  [key: string]: unknown;
}

const GenreRecommand = () => {
  const [results, setResults] = useState<RecommendItem[]>([]);
  const [searchInfo, setSearchInfo] = useState<{
    genres: string[];
    gender: string;
  } | null>(null);
  const [movieInfos, setMovieInfos] = useState<(MovieInfo | null)[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // localStorage에서 추천 결과와 검색 정보를 불러옴
    const data = localStorage.getItem("genreRecommandResults");
    const search = localStorage.getItem("genreRecommandSearchInfo");
    if (data) {
      try {
        setResults(JSON.parse(data));
      } catch {
        setResults([]);
      }
    }
    if (search) {
      try {
        setSearchInfo(JSON.parse(search));
      } catch {
        setSearchInfo(null);
      }
    }
  }, []);

  // TMDB 정보 fetch
  useEffect(() => {
    if (results.length === 0) return;
    setLoading(true);
    Promise.all(
      results.map(async (item) => {
        const title = item.TITLE || item.title || "";
        if (!title) return null;
        return await fetchMovieInfo(title);
      })
    ).then((infos) => {
      setMovieInfos(infos);
      setLoading(false);
    });
  }, [results]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto mt-10">
        <h3 className="text-2xl font-bold mb-4 text-center">장르 추천 결과</h3>
        {/* 검색 정보 표시 */}
        {searchInfo && (
          <div className="flex flex-col items-center mb-8">
            <div className="text-base text-gray-700 font-semibold mb-1">
              <span className="mr-2">검색 장르:</span>
              <span className="text-blue-600">
                {searchInfo.genres.join(", ")}
              </span>
            </div>
            <div className="text-base text-gray-700 font-semibold">
              <span className="mr-2">성별:</span>
              {searchInfo.gender === "man" ? (
                <span className="text-blue-600">남성</span>
              ) : (
                <span className="text-pink-500">여성</span>
              )}
            </div>
          </div>
        )}
        {results.length === 0 ? (
          <div className="text-center text-gray-500">추천 결과가 없습니다.</div>
        ) : loading ? (
          <div className="text-center text-gray-500">정보 불러오는 중...</div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {results.map((item, idx) => {
              const info = movieInfos[idx];
              return (
                <li
                  key={idx}
                  className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
                  onClick={() => {
                    const title = item.TITLE || item.title || "";
                    if (title)
                      router.push(`/recommand/${encodeURIComponent(title)}`);
                  }}
                >
                  <div className="relative h-64">
                    {info?.poster ? (
                      <img
                        src={info.poster}
                        alt={item.TITLE || item.title || "포스터"}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-500">포스터 없음</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {item.TITLE || item.title || "제목 없음"}
                    </h3>
                    {/* TMDB 평점 */}
                    {info?.rating && (
                      <div className="flex items-center mb-2">
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-4 h-4 ${
                                star <= Math.round(info.rating! / 2)
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
                          {(info.rating / 2).toFixed(1)}
                        </span>
                      </div>
                    )}
                    {/* 장르 표시 */}
                    {item.genres && item.genres.length > 0 && (
                      <div className="mb-1 text-xs text-blue-500 font-semibold">
                        장르: {item.genres.join(", ")}
                      </div>
                    )}
                    {/* 선호 성별 표시 */}
                    {item.PREFER && (
                      <div className="mb-1 text-xs font-semibold flex items-center gap-1">
                        {item.PREFER === "man" ? (
                          <span className="flex items-center text-blue-600">
                            <FaMars className="mr-1" />
                            남성 선호
                          </span>
                        ) : (
                          <span className="flex items-center text-pink-600">
                            <FaVenus className="mr-1" />
                            여성 선호
                          </span>
                        )}
                      </div>
                    )}
                    {/* TMDB 개요 */}
                    {info?.overview && (
                      <div className="text-sm text-gray-500 mb-1 line-clamp-2">
                        {info.overview}
                      </div>
                    )}
                    {/* 개봉일 */}
                    {info?.releaseDate && (
                      <div className="text-xs text-gray-400">
                        개봉일: {info.releaseDate}
                      </div>
                    )}
                    {/* 투표 수 */}
                    {info?.voteCount && (
                      <div className="text-xs text-gray-400">
                        투표 수: {info.voteCount.toLocaleString()}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GenreRecommand;
