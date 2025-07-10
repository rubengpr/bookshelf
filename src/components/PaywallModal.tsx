import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, Crown, Check } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import toast from "react-hot-toast";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PaywallModal({ isOpen, onClose }: PaywallModalProps) {
  const trpc = useTRPC();

  const createCheckoutMutation = useMutation(
    trpc.createStripeCheckoutSession.mutationOptions({
      onSuccess: (data) => {
        if (data.sessionUrl) {
          window.location.href = data.sessionUrl;
        }
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create checkout session");
      },
    })
  );

  const handleUpgrade = () => {
    const baseUrl = window.location.origin;
    createCheckoutMutation.mutate({
      successUrl: `${baseUrl}/upgrade/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/books?payment=cancelled`,
    });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <Crown className="h-6 w-6 text-yellow-500" />
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Upgrade to Premium
                    </Dialog.Title>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-4">
                    You've reached the limit of 5 books in your collection. Upgrade to Premium to save unlimited books!
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">Unlimited book storage</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">Advanced organization features</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">Priority support</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">$9.99</div>
                      <div className="text-sm text-gray-600">One-time payment</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md font-medium transition-colors"
                    onClick={onClose}
                  >
                    Maybe Later
                  </button>
                  <button
                    type="button"
                    onClick={handleUpgrade}
                    disabled={createCheckoutMutation.isPending}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-md font-medium transition-colors"
                  >
                    {createCheckoutMutation.isPending ? "Loading..." : "Upgrade Now"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
