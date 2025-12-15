import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LimitExceeded() {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate("/billing");          // ← ваш реальный роут на апгрейд
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50">
      <div className="bg-white/90 backdrop-blur border border-yellow-200 rounded-3xl shadow-xl p-8 max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Free Usage Limit Reached
        </h1>

        <p className="text-gray-700 mb-6 leading-relaxed">
          You have used all available free generations. Upgrade to&nbsp;
          <span className="font-semibold">WikiTruth Premium</span> to continue
          without limits and unlock additional features.
        </p>

        <Button
          onClick={handleUpgrade}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold text-lg py-3"
        >
          <Crown className="h-5 w-5 mr-2" />
          Upgrade&nbsp;to&nbsp;Premium
        </Button>
      </div>
    </div>
  );
}
