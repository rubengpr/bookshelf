import { createFileRoute, useSearch, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import { usePremiumStatus } from "~/hooks/usePremiumStatus";
import { CheckCircle, Crown, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { z } from "zod";

const successSearchSchema = z.object({
  session_id: z.string(),
});

export const Route = createFileRoute("/upgrade/success/")({
  component: UpgradeSuccessPage,
  validateSearch: successSearchSchema,
});

function UpgradeSuccessPage() {
  const trpc = useTRPC();
  const navigate = useNavigate();
  const search = useSearch({ from: "/upgrade/success/" });
  const { setPremium } = usePremiumStatus();

  const verifyPaymentMutation = useMutation(
    trpc.verifyStripePayment.mutationOptions({
      onSuccess: (data) => {
        if (data.isPremium) {
          setPremium(true);
          toast.success("Welcome to Premium! You can now add unlimited books.");
          setTimeout(() => {
            navigate({ to: "/books" });
          }, 3000);
        }
      },
      onError: (error) => {
        toast.error(error.message || "Failed to verify payment");
        setTimeout(() => {
          navigate({ to: "/books" });
        }, 3000);
      },
    })
  );

  useEffect(() => {
    if (search.session_id && !verifyPaymentMutation.isPending && !verifyPaymentMutation.isSuccess && !verifyPaymentMutation.isError) {
      verifyPaymentMutation.mutate({ sessionId: search.session_id });
    }
  }, [search.session_id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {verifyPaymentMutation.isPending ? (
          <>
            <Loader2 className="h-16 w-16 text-blue-600 mx-auto mb-6 animate-spin" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Verifying Payment...
            </h1>
            <p className="text-gray-600">
              Please wait while we confirm your payment and activate your premium features.
            </p>
          </>
        ) : verifyPaymentMutation.isSuccess ? (
          <>
            <div className="relative mb-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <Crown className="h-8 w-8 text-yellow-500 absolute -top-2 -right-2" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome to Premium!
            </h1>
            <p className="text-gray-600 mb-6">
              Your payment has been processed successfully. You now have access to unlimited book storage and premium features.
            </p>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Premium Features Unlocked:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✓ Unlimited book storage</li>
                <li>✓ Advanced organization features</li>
                <li>✓ Priority support</li>
              </ul>
            </div>
            <p className="text-sm text-gray-500">
              Redirecting you to your books in a few seconds...
            </p>
          </>
        ) : (
          <>
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-red-600 text-2xl">✕</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Payment Verification Failed
            </h1>
            <p className="text-gray-600 mb-6">
              We couldn't verify your payment. Please contact support if you believe this is an error.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting you back to your books...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
