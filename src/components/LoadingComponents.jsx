import React from 'react';
export const CourseCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse min-h-[350px] flex flex-col">
      <div className="w-full h-44 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>

      <div className="px-3 mt-3 flex-1 flex flex-col">
        <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded mb-2"></div>
        
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded mb-1 w-3/4"></div>
        
        <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded mb-2 w-1/2"></div>
        
        <div className="flex-1 space-y-2 mb-3">
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-4/5"></div>
        </div>
        
        <div className="flex gap-3 pb-3 mt-auto">
          <div className="flex-1 h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-lg"></div>
          <div className="flex-1 h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};
export const CoursesGridSkeleton = ({ count = 9 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[300px]">
      {Array.from({ length: count }).map((_, index) => (
        <CourseCardSkeleton key={index} />
      ))}
    </div>
  );
};

export const CourseDetailSkeleton = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">

      <div className="relative w-full h-80 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-[length:200%_100%] animate-shimmer overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="relative z-10 max-w-[1420px] mx-auto px-6 md:px-12 lg:px-16 py-28 md:py-32 lg:py-36">
          <div className="h-12 bg-white/20 rounded mb-4 w-3/4"></div>
          <div className="h-6 bg-white/20 rounded mb-3 w-1/2"></div>
          <div className="flex flex-wrap gap-6">
            <div className="h-4 bg-white/20 rounded w-24"></div>
            <div className="h-4 bg-white/20 rounded w-32"></div>
            <div className="h-4 bg-white/20 rounded w-28"></div>
          </div>
        </div>
      </div>

      {/* Main content skeleton */}
      <main className="flex-1 w-full max-w-[1420px] mx-auto mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10 px-6 md:px-8">
        {/* Left content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description section */}
          <section>
            <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded mb-4 w-48"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-5/6"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-4/5"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-3/4"></div>
            </div>
          </section>

          {/* Instructor section */}
          <section>
            <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded mb-4 w-32"></div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-40"></div>
            </div>
          </section>
        </div>

        {/* Sidebar skeleton */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-28">
            {/* Image */}
            <div className="w-full h-52 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-lg mb-4"></div>
            
            {/* Price */}
            <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded mb-4 w-32"></div>
            
            {/* Buttons */}
            <div className="space-y-3">
              <div className="w-full h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-lg"></div>
              <div className="w-full h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-lg"></div>
              <div className="w-full h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-lg"></div>
            </div>
            
            {/* Features */}
            <div className="mt-6 space-y-2">
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-3/4"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-2/3"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-4/5"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export const LoadingSpinner = ({ size = "md", text = "Đang tải..." }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        {/* Outer ring */}
        <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-[#910c4e] rounded-full animate-spin`}></div>
        {/* Inner ring */}
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${size === 'xl' ? 'w-10 h-10' : size === 'lg' ? 'w-8 h-8' : size === 'md' ? 'w-5 h-5' : 'w-3 h-3'} border-2 border-transparent border-t-[#b91c5a] rounded-full animate-spin`} style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
      </div>
      {text && (
        <p className="mt-4 text-gray-600 font-medium animate-pulse">{text}</p>
      )}
    </div>
  );
};

export const LoadingOverlay = ({ isVisible, text = "Đang xử lý..." }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-100 flex flex-col items-center">
        <LoadingSpinner size="xl" text={text} />
      </div>
    </div>
  );
};
export const TextSkeleton = ({ lines = 3, className = "" }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div 
          key={index}
          className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded"
          style={{ width: `${Math.random() * 30 + 70}%` }}
        ></div>
      ))}
    </div>
  );
};