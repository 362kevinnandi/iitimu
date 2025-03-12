import React from "react";

export const StatSection = () => {
  return (
    <div className="bg-backgroundPrimary py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-white text-center">
          <div>
            <div className="text-4xl font-bold mb-2">15,000+</div>
            <p className="text-pink-100">
              Projects managed with TM-iitimu, streamlining tasks and helping
              achieve goals
            </p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">300+</div>
            <p className="text-pink-100">
              Teams collaborating daily on TM-iitimu, improving communication and
              efficiency
            </p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">50,000+</div>
            <p className="text-pink-100">
              Tasks completed with TM-iitimu, helping teams stay on schedule and
              meet deadlines
            </p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">95%</div>
            <p className="text-pink-100">
              User satisfaction with TM-iitimu, reflecting improved project
              efficiency and teamwork
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
