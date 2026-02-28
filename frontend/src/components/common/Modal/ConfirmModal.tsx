import { type ConfirmModalProps } from "@/types/modal";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { Modal } from ".";
import { Button } from "../Button";

const VARIANT_ICONS = {
  danger: ExclamationTriangleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
  success: CheckCircleIcon,
};

const VARIANT_ICON_COLORS = {
  danger: "text-red-500",
  warning: "text-amber-500",
  info: "text-blue-500",
  success: "text-green-500",
};

const VARIANT_BUTTON_STYLES = {
  danger: "error",
  warning: "warning",
  info: "info",
  success: "success",
} as const;

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
  icon,
  showIcon = false,
  buttonLayout = "horizontal",
  hideCancel = false,
}: ConfirmModalProps) => {
  const IconComponent = VARIANT_ICONS[variant];
  const iconColorClass = VARIANT_ICON_COLORS[variant];
  const buttonVariant = VARIANT_BUTTON_STYLES[variant];

  const renderIcon = () => {
    if (icon) return icon;
    if (showIcon) {
      return (
        <div className="mb-4 flex justify-center">
          <IconComponent className={`h-16 w-16 ${iconColorClass}`} />
        </div>
      );
    }
    return null;
  };

  const renderButtons = () => {
    if (buttonLayout === "vertical") {
      return (
        <div className="flex flex-col gap-2">
          <Button
            onClick={onConfirm}
            isLoading={isLoading}
            className="w-full justify-center"
          >
            {confirmText}
          </Button>
          {!hideCancel && (
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
              className="w-full justify-center"
            >
              {cancelText}
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="flex justify-end gap-3">
        {!hideCancel && (
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
        )}
        <Button
          variant={buttonVariant}
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {confirmText}
        </Button>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={showIcon ? undefined : title}
      size="sm"
      showCloseButton={!showIcon}
    >
      {renderIcon()}
      {showIcon && (
        <h3 className="text-foreground mb-2 text-center text-lg font-semibold">
          {title}
        </h3>
      )}
      {description && (
        <p
          className={`text-foreground-muted mb-6 text-sm ${showIcon ? "text-center" : ""}`}
        >
          {description}
        </p>
      )}
      {renderButtons()}
    </Modal>
  );
};
