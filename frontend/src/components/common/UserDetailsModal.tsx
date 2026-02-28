/**
 * UserDetailsModal Component
 * Displays user profile information in a modal using the Modal component
 */

import { Modal } from "@/components/common/Modal";
import { useUserStore } from "@/stores";
import { useModalStore } from "@/stores/modalStore";
import { EnvelopeIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { Button } from "./Button";

const MODAL_ID = "user-details-modal";

export const UserDetailsModal = () => {
  const { user } = useUserStore();
  const { isOpen, close } = useModalStore();
  const modalIsOpen = isOpen(MODAL_ID);

  if (!user) return null;

  return (
    <Modal
      isOpen={modalIsOpen}
      onClose={() => close(MODAL_ID)}
      title="User Profile"
      size="md"
      showCloseButton={true}
      closeOnOverlayClick={true}
    >
      {/* User avatar */}
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-purple-100">
          <span className="text-2xl font-bold text-purple-600">
            {user.email.split("@")[0].slice(0, 2).toUpperCase()}
          </span>
        </div>
        <h2 className="text-foreground text-2xl font-bold">{user.email}</h2>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* Email */}
        <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-100">
          <EnvelopeIcon className="mt-0.5 h-5 w-5 shrink-0 text-purple-600" />
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500">Email</p>
            <p className="mt-1 text-sm text-gray-900">{user.email}</p>
          </div>
        </div>

        {/* Role */}
        <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-100">
          <ShieldCheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-purple-600" />
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500">Role</p>
            <p className="mt-1 text-sm text-gray-900 capitalize">{user.role}</p>
          </div>
        </div>
      </div>

      {/* Footer Button */}
      <div className="mt-6 flex gap-3">
        <Button
          onClick={() => close(MODAL_ID)}
          variant="primary"
          className="w-full justify-center"
        >
          Close
        </Button>
      </div>
    </Modal>
  );
};
