import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-xl border border-gray-100/50 p-6 space-y-4">
    <div className="flex items-center space-x-4">
      <div className="h-12 w-12 rounded-xl skeleton"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 rounded skeleton"></div>
        <div className="h-3 w-1/2 rounded skeleton"></div>
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 w-full rounded skeleton"></div>
      <div className="h-3 w-5/6 rounded skeleton"></div>
      <div className="h-3 w-4/6 rounded skeleton"></div>
    </div>
    <div className="flex justify-between items-center pt-4">
      <div className="h-8 w-24 rounded-xl skeleton"></div>
      <div className="h-8 w-24 rounded-xl skeleton"></div>
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="space-y-3">
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center space-x-4">
        <div className="h-10 w-10 rounded-full skeleton"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 rounded skeleton"></div>
          <div className="h-3 w-1/4 rounded skeleton"></div>
        </div>
        <div className="h-8 w-20 rounded-xl skeleton"></div>
      </div>
    ))}
   </div>
);

export const StatCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-xl border border-gray-100/50 p-6 space-y-4">
    <div className="flex items-center justify-between">
      <div className="h-10 w-10 rounded-xl skeleton"></div>
      <div className="h-6 w-16 rounded skeleton"></div>
    </div>
    <div className="space-y-2">
      <div className="h-8 w-24 rounded skeleton"></div>
      <div className="h-4 w-32 rounded skeleton"></div>
    </div>
  </div>
);

export const FormSkeleton = () => (
  <div className="space-y-6">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="space-y-2">
        <div className="h-4 w-32 rounded skeleton"></div>
        <div className="h-12 w-full rounded-xl skeleton"></div>
      </div>
    ))}
    <div className="h-12 w-full rounded-xl skeleton"></div>
  </div>
);

export const ListSkeleton = ({ items = 4 }) => (
  <div className="space-y-3">
    {[...Array(items)].map((_, i) => (
      <div key={i} className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-100">
        <div className="h-12 w-12 rounded-xl skeleton"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/2 rounded skeleton"></div>
          <div className="h-3 w-1/3 rounded skeleton"></div>
        </div>
        <div className="h-8 w-8 rounded-full skeleton"></div>
      </div>
    ))}
  </div>
);

export default { CardSkeleton, TableSkeleton, StatCardSkeleton, FormSkeleton, ListSkeleton };
