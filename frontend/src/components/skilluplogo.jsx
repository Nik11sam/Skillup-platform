export default function SkillUpLogo() {
  return (
    <div className="flex items-center space-x-2">
      {/* Arrow + Bargraph Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-red-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 17l6-6 4 4 8-8M13 21h8M17 17v4"
        />
      </svg>

      {/* Text */}
      <span className="text-2xl font-bold text-gray-800">SkillUp</span>
    </div>
  );
}
