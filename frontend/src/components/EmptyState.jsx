import React from 'react';
import { FileX, Inbox, Search } from 'lucide-react';

const EmptyState = ({ 
  icon = 'inbox', 
  title = 'No data found', 
  description = 'There are no items to display at the moment.',
  action = null 
}) => {
  const icons = {
    inbox: Inbox,
    file: FileX,
    search: Search,
  };

  const Icon = icons[icon] || Inbox;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-gray-100 rounded-full p-6 mb-4">
        <Icon className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-center max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
