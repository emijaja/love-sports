export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 to-blue-100 p-8">
      <main className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-6">
          Love Sports
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
          スポーツイベント向けリアルタイムマッチングシステム
        </p>
        <p className="text-lg text-gray-500">
          心拍数と距離データで新しい出会いを創造
        </p>
      </main>
    </div>
  );
}
