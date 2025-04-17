'use client';

export default function TestTailwind() {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">Tailwind CSS Test</h1>
        <p className="text-gray-700 mb-4">
          This is a test page to verify that Tailwind CSS is working correctly.
        </p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-100 p-4 rounded-md text-blue-800">Blue Box 1</div>
          <div className="bg-blue-200 p-4 rounded-md text-blue-800">Blue Box 2</div>
        </div>
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
          Test Button
        </button>
      </div>
    </div>
  );
} 