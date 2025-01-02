import { SystemLogEntry } from '../../../types/systemLog';

interface LogItemsProps {
    filteredLogs: SystemLogEntry[];
}

const LogItems = ({filteredLogs}:LogItemsProps) => {
    return (
        <>
            {filteredLogs?.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(log?.time).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-pre-wrap">
                    {log?.message}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      log?.type === 'error' 
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {log?.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log?.context || "~"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="max-w-lg overflow-hidden ">
                      {log?.trace?.slice(0,140) || "~"}
                    </div>
                  </td>
                </tr>
              ))}
        </>
    );
};

export default LogItems;