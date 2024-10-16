import React from 'react';

function CurrentResult({ currentResult }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-8 w-full md:w-2/3">
      <h3 className="text-2xl font-semibold text-gray-900 mb-4">结果:</h3>
      {currentResult.length > 0 ? (
        <ul className="list-disc list-inside space-y-2">
          {currentResult.map((text, index) => (
            <li key={index} className="text-lg text-gray-700">{text}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">暂无识别色号</p>
      )}
    </div>
  );
}

export default CurrentResult;