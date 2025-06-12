
import { ReactNode } from "react";

interface BrowserFrameProps {
  children: ReactNode;
}

export const BrowserFrame = ({ children }: BrowserFrameProps) => (
  <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
    <div className="flex items-center space-x-2 px-4 py-3 border-b border-gray-200">
      <div className="flex space-x-1.5">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
      </div>
      <div className="flex-1 flex justify-center">
        <div className="bg-gray-100 rounded-md px-4 py-1 text-xs text-gray-600">
          postarc.ai/dashboard
        </div>
      </div>
    </div>
    
    <div className="p-6">
      {children}
    </div>
  </div>
);
