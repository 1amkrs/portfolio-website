import React from 'react';

export const MarqueeTicker = ({ className = "" }) => {
  const items = [
    "Karthik Satheesh",
    "UI/UX Designer",
    "Multidisciplinary Designer",
    "Creative Engineer",
    "Digital Architect",
    "Interaction Designer"
  ];

  // Duplicate list to create a flawless 50% translation loop
  const seamlessList = [...items, ...items, ...items, ...items];

  return (
    <div className={`overflow-hidden whitespace-nowrap py-3 sm:py-4 bg-[#DFFCA1] text-[#094020] border-y border-[#094020]/20 select-none ${className}`}>
      <div className="animate-marquee flex items-center gap-10 sm:gap-14">
        {seamlessList.map((item, idx) => (
          <div key={idx} className="flex items-center gap-8 sm:gap-12 shrink-0">
            {/* Unboxed Enlarged Copyright Symbol */}
            <span className="text-2xl sm:text-4xl md:text-5xl font-medium select-none shrink-0">
              &copy;
            </span>
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
