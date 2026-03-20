import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="px-2 md:px-24 min-h-52 bg-white grid grid-cols-1 gap-4 md:grid-cols-3 text-sm py-4">
      {/* Công ty */}
      <div>
        <h2 className="font-bold mb-1">Về công ty</h2>
        <ul>
          <Link href="">
            <Image
              src={"/uploads/tbao.webp"}
              width={100}
              height={100}
              alt="Chứng nhận bộ công thường"
              className="w-36"
            ></Image>
          </Link>
          <li>Giấy phép ĐKKD: 01F8010658</li>
          <li>Cấp ngày: 15/03/2017 tại UBND Q.Thanh Xuân</li>
        </ul>
      </div>
      {/* Chính sách */}
      <div>
        <h2 className="font-bold mb-1">Chính sách - Quy định</h2>
        <ul className="flex flex-col space-y-2">
          <Link href="" className="hover:text-primary">
            Chính sách đổi trả
          </Link>
          <Link href="" className="hover:text-primary">
            Chính sách bảo hành
          </Link>
          <Link href="" className="hover:text-primary">
            Quy định về thanh toán
          </Link>
          <Link href="" className="hover:text-primary">
            Chính sách bảo mật thông tin khách hàng
          </Link>
        </ul>
      </div>
      {/*  */}

      {/* Liên hệ */}
      <div>
        <h2 className="font-bold mb-1">Địa chỉ liên hệ</h2>
        <div>
          <i className="bx bxs-map mr-2"></i>
          1042 Quang Trung, Gò Vấp, Hồ Chí Minh
        </div>
        <div>
          <i className="bx bxs-phone mr-2"></i>
          0922.468.323
        </div>
      </div>
    </footer>
  );
}
