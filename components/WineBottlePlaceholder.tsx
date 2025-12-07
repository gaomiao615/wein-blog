'use client';

interface WineBottlePlaceholderProps {
  wineName: string;
  color?: 'red' | 'white' | 'rose';
  className?: string;
}

/**
 * 纯CSS酒瓶占位符组件
 * 不依赖任何外部资源，确保始终显示
 */
export function WineBottlePlaceholder({ 
  wineName, 
  color = 'red',
  className = '' 
}: WineBottlePlaceholderProps) {
  const colorClasses = {
    red: 'from-red-900 to-red-700',
    white: 'from-amber-200 to-amber-400',
    rose: 'from-pink-400 to-pink-600'
  };

  return (
    <div className={`relative ${className}`}>
      {/* 酒瓶形状容器 */}
      <div className="relative w-48 h-96 lg:w-64 lg:h-[600px] mx-auto">
        {/* 瓶身 */}
        <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 lg:w-40 h-80 lg:h-[500px] bg-gradient-to-b ${colorClasses[color]} rounded-t-3xl rounded-b-lg shadow-2xl`}>
          {/* 瓶口 */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-8 lg:w-10 h-8 lg:h-10 bg-gray-300 rounded-t-lg"></div>
          {/* 瓶颈 */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 lg:w-16 h-4 lg:h-6 bg-gradient-to-b from-gray-200 to-gray-300 rounded-t-lg"></div>
          
          {/* 标签区域 */}
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-24 lg:w-32 h-32 lg:h-40 bg-white/20 backdrop-blur-sm rounded-lg border-2 border-white/30 flex items-center justify-center">
            <div className="text-center px-2">
              <div className="text-4xl lg:text-5xl mb-2">🍷</div>
              <div className="text-white text-xs lg:text-sm font-semibold break-words">
                {wineName.substring(0, 20)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

