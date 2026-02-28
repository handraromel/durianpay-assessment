"use client";

import { TRANSITION_MS } from "@/constants/modal";
import { type ModalProps } from "@/types/modal";
import {
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Fragment, useState } from "react";
import { useModal } from "./useModal";

const SIZE_CLASSES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
};

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  showCloseButton = true,
  closeOnOverlayClick = false,
  toggleFullscreen,
  stickyHeader,
}: ModalProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // useModal encapsulates the snapshot & timer logic so the component stays small
  const { preservedChildren, shouldRender } = useModal(
    isOpen,
    children,
    TRANSITION_MS,
  );

  if (!shouldRender) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        open={shouldRender}
        onClose={closeOnOverlayClick ? onClose : () => {}}
        className="relative z-50"
      >
        {/* Backdrop (fade) */}
        <TransitionChild
          as={Fragment}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <DialogBackdrop className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </TransitionChild>

        {/* Modal Container */}
        <div className="fixed inset-0 flex w-screen items-center justify-center overflow-y-auto p-4">
          <TransitionChild
            as={Fragment}
            enter="transition duration-300 ease-out"
            enterFrom="scale-95 opacity-0"
            enterTo="scale-100 opacity-100"
            leave="transition duration-300 ease-in"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-95 opacity-0"
          >
            <DialogPanel
              className={`${
                isFullscreen
                  ? "bg-background-elevated h-full max-h-full w-full max-w-full"
                  : `${SIZE_CLASSES[size]} my-auto max-h-[90vh]`
              } bg-background-elevated w-full transform overflow-y-auto rounded-xl p-6 shadow-xl [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent`}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div
                  className={`mb-4 flex items-start justify-between ${
                    stickyHeader
                      ? "bg-background-elevated sticky -top-6.5 z-10 -mx-6 -mt-6 px-6 pt-6 pb-4"
                      : ""
                  }`}
                >
                  <div>
                    {title && (
                      <DialogTitle className="text-foreground text-lg font-semibold">
                        {title}
                      </DialogTitle>
                    )}
                    {description && (
                      <Description className="text-foreground-muted mt-1 text-sm">
                        {description}
                      </Description>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {toggleFullscreen && (
                      <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="text-foreground-muted hover:bg-background hover:text-foreground rounded-lg p-1 transition-colors"
                        title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                      >
                        {isFullscreen ? (
                          <ArrowsPointingInIcon className="h-5 w-5" />
                        ) : (
                          <ArrowsPointingOutIcon className="h-5 w-5" />
                        )}
                      </button>
                    )}
                    {showCloseButton && (
                      <button
                        onClick={onClose}
                        className="text-foreground-muted hover:bg-background hover:text-foreground rounded-lg p-1 transition-colors"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Content (show live children while open, fallback to preserved snapshot while closing) */}
              <div>{isOpen ? children : preservedChildren}</div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export { ConfirmModal } from "./ConfirmModal";
