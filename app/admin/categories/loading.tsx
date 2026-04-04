export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Title Skeleton */}
      <div className="h-8 bg-surface w-48 rounded-md mb-6 border border-border/50" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Skeleton */}
        <div className="bg-white rounded-xl border border-border p-5">
           <div className="h-6 bg-surface w-40 rounded-md mb-5" />
           <div className="space-y-4">
             <div>
               <div className="h-4 bg-surface w-48 rounded-md mb-2" />
               <div className="h-10 bg-surface rounded-lg w-full" />
             </div>
             <div>
               <div className="h-4 bg-surface w-24 rounded-md mb-2" />
               <div className="h-10 bg-surface rounded-lg w-full" />
             </div>
             <div className="h-11 bg-primary/20 rounded-lg w-full mt-4" />
           </div>
        </div>

        {/* Table Skeleton */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
           <div className="w-full">
              <div className="bg-surface/60 border-b border-border px-4 py-3 h-11 w-full" />
              <div className="flex flex-col">
                 <div className="h-12 border-b border-border px-4 py-2 flex items-center gap-4">
                    <div className="h-4 bg-surface w-1/3 rounded" />
                    <div className="h-4 bg-surface/50 w-1/4 rounded" />
                 </div>
                 <div className="h-12 border-b border-border px-4 py-2 flex items-center gap-4">
                    <div className="h-4 bg-surface w-1/4 rounded" />
                    <div className="h-4 bg-surface/50 w-1/3 rounded" />
                 </div>
                 <div className="h-12 border-b border-border px-4 py-2 flex items-center gap-4">
                    <div className="h-4 bg-surface w-2/5 rounded" />
                    <div className="h-4 bg-surface/50 w-1/5 rounded" />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
