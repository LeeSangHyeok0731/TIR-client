"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const Donation = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">후원하기</h1>
          <p className="text-gray-600 text-lg">
            프로젝트 발전을 위한 후원을 부탁드립니다
          </p>
        </div>

        {/* 후원 계좌 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 경주 계좌 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">경주 계좌</h2>
            <div className="mb-6">
              <Image
                src="/경주계좌QR.png"
                alt="경주 계좌 QR 코드"
                width={200}
                height={200}
                className="mx-auto rounded-lg shadow-md"
              />
            </div>
            <p className="text-gray-600 mb-2">
              QR 코드를 스캔하여 후원해주세요
            </p>
            <p className="text-blue-600 font-semibold mb-2">
              권장 후원금: 1,000원
            </p>
            <p className="text-sm text-gray-500">
              * QR 코드를 통해 간편하게 후원하실 수 있습니다
            </p>
          </div>

          {/* 상혁 계좌 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">상혁 계좌</h2>
            <div className="mb-6">
              <Image
                src="/상혁계좌QR.png"
                alt="상혁 계좌 QR 코드"
                width={200}
                height={200}
                className="mx-auto rounded-lg shadow-md"
              />
            </div>
            <p className="text-gray-600 mb-2">
              QR 코드를 스캔하여 후원해주세요
            </p>
            <p className="text-blue-600 font-semibold mb-2">
              권장 후원금: 1,000원
            </p>
            <p className="text-sm text-gray-500">
              * QR 코드를 통해 간편하게 후원하실 수 있습니다
            </p>
          </div>
        </div>

        {/* 안내 문구 */}
        <div className="mt-12 text-center">
          <div className="bg-blue-50 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-blue-800 mb-3">
              후원 안내
            </h3>
            <p className="text-blue-700 mb-2">
              여러분의 후원은 프로젝트의 지속적인 발전과 개선에 사용됩니다.
            </p>
            <p className="text-blue-700">감사합니다! 🙏</p>
          </div>
        </div>

        {/* 뒤로가기 버튼 */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.back()}
            className="bg-gray-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-600 transition-all duration-300"
          >
            뒤로가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Donation;
