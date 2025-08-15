// app/ui/Comment.jsx
const Comment = ({ time, content }) => {
  // 시간 포맷팅 (DB에서 가져온 시간을 읽기 쉽게 변환)
  const formatTime = (timeString) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleString("ko-KR", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return timeString; // 포맷팅 실패시 원본 반환
    }
  };

  return (
    <div className="mb-4 border-b border-b-gray-200 py-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-bold">익명</span>
        <span className="text-gray-500 text-sm">{formatTime(time)}</span>
      </div>
      <p className="text-gray-800 mt-3">{content}</p>
    </div>
  );
};

export default Comment;