import { User } from '../../types/user';
import { UserActivityGraph } from './UserActivityGraph';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../../lib/utils';

interface UserActivityRowProps {
  user: User;
  selectedMetric: 'clicks' | 'online';
}

export function UserActivityRow({ user, selectedMetric }: UserActivityRowProps) {
  const isOnline = (lastSeen: string) => {
    const lastSeenDate = new Date(lastSeen);
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return lastSeenDate > fiveMinutesAgo;
  };

  const {
    username = "~",
    company = {name:"~"},
    lastOnline = "~",
    clicks = "~"
  } = user

  return (
    <tr className="hover:bg-gray-50 ">
      <td className="px-4 py-4 ">
        <div className="flex items-center">
          <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {username[0].toUpperCase()}
            </span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{username}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{company.name || "~"}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">
          {formatDistanceToNow(new Date(lastOnline), { addSuffix: true })}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={cn(
          "px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full",
          isOnline(lastOnline)
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-800"
        )}>
          {isOnline(lastOnline) ? 'Online' : 'Offline'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {clicks}
      </td>
      <td className="px-6 py-4">
        <UserActivityGraph
          data={user.points}
          type={selectedMetric}
        />
      </td>
    </tr>
  );
}