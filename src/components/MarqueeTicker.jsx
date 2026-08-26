import React from 'react';

export const MarqueeTicker = ({ className = "" }) => {
  const items = [
    "Karthik Satheesh",
    "UI/UX Designer",
    "Multidisciplinary Designer",
    "Creative Engineer",
    "Digital Architect",
    "Systems Designer"
  ];

  // Duplicate list to create a flawless 50% translation loop
  const seamlessList = [...items, ...items, ...items, ...items];

  return (
    <div className={`overflow-hidden whitespace-nowrap py-3 sm:py-4 bg-[#DFFCA1] text-[#094020] border-y border-[#094020]/20 select-none ${className}`}>
      <div className="animate-marquee flex items-center gap-10 sm:gap-14">
        {seamlessList.map((item, idx) => (
          <div key={idx} className="flex items-center gap-8 sm:gap-12 shrink-0">
            {/* Stamp Logo Box */}
            <div className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-[#094020] flex items-center justify-center font-editorial font-bold text-base sm:text-lg shrink-0">
              &copy;
            </div>
            {/* Bold Text */}
            <span className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-[-0.04em] whitespace-nowrap">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
