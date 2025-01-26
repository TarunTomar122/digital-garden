export default function Loading() {
    return (
        <main className='flex justify-center xl:px-60'>
            <div className='min-w-full md:container px-8 md:px-28 lg:px-60'>
                <div className="animate-pulse">
                    {/* Title skeleton */}
                    <div className="h-10 bg-gray-700 rounded w-3/4 mb-4"></div>
                    
                    {/* Date skeleton */}
                    <div className="h-6 bg-gray-700 rounded w-32 mb-6"></div>
                    
                    {/* Tags skeleton */}
                    <div className="flex gap-2 mb-6">
                        <div className="h-6 bg-gray-700 rounded w-16"></div>
                        <div className="h-6 bg-gray-700 rounded w-20"></div>
                        <div className="h-6 bg-gray-700 rounded w-24"></div>
                    </div>
                    
                    {/* Content skeleton */}
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-700 rounded w-full"></div>
                        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-700 rounded w-4/6"></div>
                        <div className="h-4 bg-gray-700 rounded w-full"></div>
                        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    </div>
                </div>
            </div>
        </main>
    )
}