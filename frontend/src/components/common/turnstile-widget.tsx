"use client";
import env from "@/constants/env";
import React from "react";

declare global {
  interface Window {
    turnstile: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void | Promise<void>;
          "error-callback": () => void;
        }
      ) => string;
      remove: (id: string) => void;
    };
  }
}

interface Props {
  onVerify: (token: string) => Promise<void>;
}

export default function TurnstileWidget({ onVerify }: Props) {
  //   const turnstile = useTurnstile();
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!ref.current || !window.turnstile) return;
    const id = window.turnstile.render(ref.current, {
      sitekey: env.NEXT_PUBLIC_TURNSTILE_KEY,
      callback: onVerify,
      "error-callback": () => {
        console.error("Turnstile error");
      },
    });

    return () => {
      window.turnstile.remove(id);
    };
  }, [onVerify]);

  return <div ref={ref}></div>;
}
