"use client";
import { Button } from "@/components/ui/button";
import { SECURITY_CODE } from "@/constants/api-code";
import { authService } from "@/libs/services/auth.service";
import { useModalActions } from "@/store/modal-store";
import { createErrorHandler } from "@/utils/response-handler";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

export default function FloatButton() {
  const { openModal, closeModal } = useModalActions();
  const { mutate: testCaptcha, isPending } = useMutation({
    mutationFn: ({ captchaToken }: { captchaToken?: string }) =>
      authService.test(captchaToken),
    onSuccess: () => toast.success("Test thành công!"),
    onError: (error) => {
      const errorHandler = createErrorHandler(
        [
          {
            code: SECURITY_CODE.TOO_MANY_REQUESTS,
            handler: () =>
              openModal({
                type: "captcha",
                props: {
                  onVerify: async (token) => {
                    testCaptcha({ captchaToken: token });
                    closeModal();
                  },
                },
              }),
          },
        ],
        [
          {
            type: "API",
            handler: (message) => {
              toast.error(message);
            },
          },
        ]
      );
      errorHandler(error);
    },
  });
  return (
    <div className="fixed bottom-4 right-4 flex flex-col space-y-6">
      <button
        type="button"
        className="size-10 rounded-full bg-white shadow-2xl grid place-items-center cursor-pointer"
        onClick={() => scrollTo({ top: 0, behavior: "smooth" })}
      >
        <i className="bx bxs-up-arrow text-2xl"></i>
      </button>

      <Button
        // href={"#"}
        // target="_blank"
        className="size-10 rounded-full overflow-hidden bg-primary grid place-items-center cursor-pointer glow-hover"
        onClick={() => {
          if (isPending) return;
          testCaptcha({});
        }}
      >
        <Image
          src="/uploads/zalo.png"
          alt="zalo"
          width={100}
          height={100}
          className="size-full object-cover"
        ></Image>
        {/* <i className="bx bxs-message-rounded-dots text-white text-2xl"></i> */}
      </Button>
    </div>
  );
}
