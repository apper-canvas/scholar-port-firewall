import React from "react";
import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="p-6 space-y-4">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-48 animate-pulse"></div>
        <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-32 animate-pulse"></div>
      </div>
      
      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-24 animate-pulse bg-[length:200%_100%] animate-[shimmer_2s_infinite]"></div>
                <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-16 animate-pulse bg-[length:200%_100%] animate-[shimmer_2s_infinite_0.5s]"></div>
              </div>
              <div className="h-12 w-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-pulse bg-[length:200%_100%] animate-[shimmer_2s_infinite_1s]"></div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Table skeleton */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-32 animate-pulse bg-[length:200%_100%] animate-[shimmer_2s_infinite]"></div>
        </div>
        <div className="divide-y divide-gray-200">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-6 flex items-center space-x-4">
              <div className="h-10 w-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-pulse bg-[length:200%_100%] animate-[shimmer_2s_infinite]" style={{ animationDelay: `${i * 0.2}s` }}></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-48 animate-pulse bg-[length:200%_100%] animate-[shimmer_2s_infinite]" style={{ animationDelay: `${i * 0.2 + 0.3}s` }}></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-32 animate-pulse bg-[length:200%_100%] animate-[shimmer_2s_infinite]" style={{ animationDelay: `${i * 0.2 + 0.6}s` }}></div>
              </div>
              <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-20 animate-pulse bg-[length:200%_100%] animate-[shimmer_2s_infinite]" style={{ animationDelay: `${i * 0.2 + 0.9}s` }}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;