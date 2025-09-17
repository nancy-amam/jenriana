import { Home } from "lucide-react";

export default function ApartmentLoadingPage() {
  return (
    <div className=" ">
      <div className="flex flex-col items-center justify-center h-64 gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-500 rounded-full animate-bounce"></div>
          <div
            className="w-3 h-3 bg-black/70 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="flex items-center justify-center animate-bounce"
            style={{ animationDelay: "0.2s" }}
          >
            <Home className="w-6 h-6 text-teal-600" />
          </div>
          <div
            className="w-3 h-3 bg-black/70 rounded-full animate-bounce"
            style={{ animationDelay: "0.3s" }}
          ></div>
          <div
            className="w-3 h-3 bg-gray-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>

        <div className="text-slate-600 text-lg font-medium">
          Loading apartments...
        </div>
      </div>
    </div>
  );
}
