'use client';

const ProjectListSkeleton = () => {
    return (
        <div className="space-y-12 mt-8">
            {/* Generate 4 skeleton items */}
            {[...Array(3)].map((_, index) => (
                <div key={index} className="border-gray-400 border-opacity-40 pb-8">
                    {/* Title skeleton */}
                    <div className="h-8 w-3/4 bg-gray-700 rounded-md animate-pulse mb-4"></div>
                    
                    {/* Tags skeleton */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {[...Array(4)].map((_, tagIndex) => (
                            <div 
                                key={tagIndex}
                                className="h-6 w-16 bg-gray-700 rounded-full animate-pulse"
                            ></div>
                        ))}
                    </div>
                    
                    {/* Description skeleton */}
                    <div className="space-y-2">
                        <div className="h-4 w-full bg-gray-700 rounded-md animate-pulse"></div>
                        <div className="h-4 w-5/6 bg-gray-700 rounded-md animate-pulse"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProjectListSkeleton;