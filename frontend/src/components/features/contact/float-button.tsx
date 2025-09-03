"use client";
import { ENV_ZALO_LINK } from "@/constants/env";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function FloatButton() {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col space-y-6">
      <button
        type="button"
        className="size-10 rounded-full bg-white shadow-2xl grid place-items-center cursor-pointer"
        onClick={() => scrollTo({ top: 0, behavior: "smooth" })}
      >
        <i className="bx bxs-up-arrow text-2xl"></i>
      </button>

      <Link
        href={ENV_ZALO_LINK || ""}
        target="_blank"
        className="size-10 rounded-full overflow-hidden bg-primary grid place-items-center cursor-pointer glow-hover"
        // onClick={() => {
        //   window.open(ENV_ZALO_LINK, "_blank");
        // }}
      >
        <Image
          src="/uploads/zalo.png"
          alt="zalo"
          width={100}
          height={100}
          className="size-full object-cover"
        ></Image>
        {/* <i className="bx bxs-message-rounded-dots text-white text-2xl"></i> */}
      </Link>
    </div>
  );
}
