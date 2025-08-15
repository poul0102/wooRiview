import React from "react";

// 내용 입력 인풋, 등록 버튼이 있는 컴포넌트
const PostForm = () => {
  return (
    <form className="flex items-center space-x-2">
      <textarea
        type="text"
        placeholder="내용을 입력하세요"
        className="flex-grow h-25 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
      <button
        type="submit"
        className="bg-blue-200 hover:bg-blue-300 text-white font-semibold py-10 px-10 rounded-md transition-colors"
      >
        등록
      </button>
    </form>
  );
};

export default PostForm;
