import { Loader } from "lucide-react";

const Loading = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-background">
      <Loader size={40} className="animate-spin" />
    </div>
  );
};

export default Loading;
