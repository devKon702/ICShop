import { IMockProductCategory } from "@/types/product";

export const mockProductCatergory: IMockProductCategory[] = [
  {
    id: 1,
    name: "Linh kiện điện tử",
    image: "/uploads/ic-1.png",
    types: [
      {
        id: 1,
        category: "Điện Trở",
        subcategories: [
          {
            id: "resistor_combo",
            name: "Combo Điện Trở",
            products: [
              {
                id: "r1",
                name: "Combo 100 điện trở 1/4W",
                price: 1000,
                image: "/uploads/ic.jpg",
              },
              {
                id: "r2",
                name: "Combo điện trở chân đồng",
                price: 1200,
                image: "/uploads/ic.jpg",
              },
            ],
          },
          {
            id: "resistor_single",
            name: "Điện Trở Đơn",
            products: [
              {
                id: "r3",
                name: "Điện trở 10k 1/4W",
                price: 100,
                image: "/uploads/ic.jpg",
              },
              {
                id: "r4",
                name: "Điện trở 1k 1/4W",
                price: 100,
                image: "/uploads/ic.jpg",
              },
            ],
          },
        ],
      },
      {
        id: 2,
        category: "Chiết Áp - Biến Trở",
        subcategories: [
          {
            id: "bien_tro_3362p",
            name: "Biến Trở 3362P",
            products: [
              {
                id: "vr1",
                name: "Biến trở 3362P 10k",
                price: 300,
                image: "/uploads/ic.jpg",
              },
              {
                id: "vr2",
                name: "Biến trở 3362P 1k",
                price: 300,
                image: "/uploads/ic.jpg",
              },
            ],
          },
          {
            id: "bien_tro_3296w",
            name: "Biến Trở 3296W",
            products: [
              {
                id: "vr3",
                name: "Biến trở 3296W 10k",
                price: 350,
                image: "/uploads/ic.jpg",
              },
            ],
          },
        ],
      },
      {
        id: 3,
        category: "Tụ Điện",
        subcategories: [
          {
            id: "ceramic_capacitor",
            name: "Tụ Gốm",
            products: [
              {
                id: "c1",
                name: "Tụ gốm 104",
                price: 150,
                image: "/uploads/ic.jpg",
              },
              {
                id: "c2",
                name: "Tụ gốm 103",
                price: 150,
                image: "/uploads/ic.jpg",
              },
            ],
          },
          {
            id: "electrolytic_capacitor",
            name: "Tụ Hóa",
            products: [
              {
                id: "c3",
                name: "Tụ hóa 100uF 25V",
                price: 200,
                image: "/uploads/ic.jpg",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "IC chức năng",
    image: "/uploads/ic-2.jpg",
    types: [
      {
        id: 10,
        category: "IC Nguồn",
        subcategories: [
          {
            id: "ic_pn",
            name: "IC Nguồn PN",
            products: [
              {
                id: "ic1",
                name: "IC nguồn 7805",
                price: 300,
                image: "/uploads/ic.jpg",
              },
            ],
          },
        ],
      },
      {
        id: 11,
        category: "IC Chức Năng",
        subcategories: [
          {
            id: "ic_oscillator",
            name: "IC Dao Động",
            products: [
              {
                id: "ic2",
                name: "IC NE555",
                price: 310,
                image: "/uploads/ic.jpg",
              },
            ],
          },
        ],
      },
      {
        id: 12,
        category: "Vi Điều Khiển",
        subcategories: [
          {
            id: "vidk_avr",
            name: "AVR",
            products: [
              {
                id: "mcu1",
                name: "ATmega328P",
                price: 1900,
                image: "/uploads/ic.jpg",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Module cảm biến",
    image: "/uploads/ic-3.png",
    types: [
      {
        id: 7,
        category: "Module",
        subcategories: [
          {
            id: "rf_module",
            name: "Module RF/RFID",
            products: [
              {
                id: "m1",
                name: "Module RFID RC522",
                price: 1500,
                image: "/uploads/ic.jpg",
              },
            ],
          },
        ],
      },
      {
        id: 8,
        category: "Cảm Biến",
        subcategories: [
          {
            id: "gas_sensor",
            name: "Cảm Biến Khí",
            products: [
              {
                id: "s1",
                name: "Cảm biến khí MQ-2",
                price: 900,
                image: "/uploads/ic.jpg",
              },
            ],
          },
        ],
      },
      {
        id: 9,
        category: "Mạch Nạp",
        subcategories: [
          {
            id: "machnap_avr",
            name: "Mạch Nạp AVR",
            products: [
              {
                id: "mp1",
                name: "Mạch nạp USBasp",
                price: 2100,
                image: "/uploads/ic.jpg",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 4,
    name: "Phụ kiện điện tử",
    image: "/uploads/ic-4.jpg",
    types: [
      {
        id: 4,
        category: "Relay - Rơ Le",
        subcategories: [
          {
            id: "relay_5v",
            name: "Relay 5V",
            products: [
              {
                id: "re1",
                name: "Relay 5V 1 kênh",
                price: 700,
                image: "/uploads/ic.jpg",
              },
            ],
          },
        ],
      },
      {
        id: 5,
        category: "Cầu Chì",
        subcategories: [
          {
            id: "fuse_3x10",
            name: "Cầu Chì 3x10",
            products: [
              {
                id: "f1",
                name: "Cầu chì 250V 2A 3x10",
                price: 100,
                image: "/uploads/ic.jpg",
              },
            ],
          },
        ],
      },
      {
        id: 6,
        category: "Nút Nhấn",
        subcategories: [
          {
            id: "mini_button",
            name: "Nút Nhấn Siêu Nhỏ",
            products: [
              {
                id: "b1",
                name: "Nút nhấn dán 6x6",
                price: 90,
                image: "/uploads/ic.jpg",
              },
            ],
          },
        ],
      },
    ],
  },
];
