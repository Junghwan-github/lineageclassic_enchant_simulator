"use client";
import styles from "./display.module.css";
import Image from "next/image";
import background from "@/assets/images/main_display.png";
import bottomUI from "@/assets/images/bottom_ui_bar.png";
import rightUI from "@/assets/images/inven_emty_bar.png";
import { useEffect, useMemo, useRef, useState } from "react";
import { DisplayData } from "@/widgets/content/content";

const ENCHANT_SCROLL_MAP: Record<number, "weapon" | "armor"> = {
  1: "weapon",
  54: "weapon",
  2: "armor",
  55: "armor",
};

// 일반 무기 마법 주문서 확률
const WEAPON_SCROLL_1_RATES: Record<
  number,
  {
    success: number;
    keep?: number;
    destroy: number;
  }
> = {
  6: { success: 33.3333333, destroy: 66.6666667 },
  7: { success: 33.3333333, destroy: 66.6666667 },
  8: { success: 33.3333333, destroy: 66.6666667 },
  9: { success: 0.9009009, keep: 32.4324324, destroy: 66.6666667 },
  10: { success: 0.8130081, keep: 32.5203252, destroy: 66.6666667 },
  11: { success: 0.7407407, keep: 32.5925926, destroy: 66.6666667 },
};

// 축복 받은 무기 마법 주문서 확률
const WEAPON_SCROLL_54_RATES: Record<
  number,
  Array<{
    nextEnchant?: number;
    result: "success" | "keep" | "destroy";
    chance: number;
  }>
> = {
  0: [
    { nextEnchant: 1, result: "success", chance: 33.3333333 },
    { nextEnchant: 2, result: "success", chance: 33.3333333 },
    { nextEnchant: 3, result: "success", chance: 33.3333333 },
  ],
  1: [
    { nextEnchant: 2, result: "success", chance: 33.3333333 },
    { nextEnchant: 3, result: "success", chance: 33.3333333 },
    { nextEnchant: 4, result: "success", chance: 33.3333333 },
  ],
  2: [
    { nextEnchant: 3, result: "success", chance: 33.3333333 },
    { nextEnchant: 4, result: "success", chance: 33.3333333 },
    { nextEnchant: 5, result: "success", chance: 33.3333333 },
  ],
  3: [
    { nextEnchant: 4, result: "success", chance: 50 },
    { nextEnchant: 5, result: "success", chance: 50 },
  ],
  4: [
    { nextEnchant: 5, result: "success", chance: 50 },
    { nextEnchant: 6, result: "success", chance: 50 },
  ],
  5: [
    { nextEnchant: 6, result: "success", chance: 50 },
    { nextEnchant: 7, result: "success", chance: 50 },
  ],
  6: [
    { nextEnchant: 7, result: "success", chance: 33.3333333 },
    { result: "destroy", chance: 66.6666667 },
  ],
  7: [
    { nextEnchant: 8, result: "success", chance: 33.3333333 },
    { result: "destroy", chance: 66.6666667 },
  ],
  8: [
    { nextEnchant: 9, result: "success", chance: 33.3333333 },
    { result: "destroy", chance: 66.6666667 },
  ],
  9: [
    { nextEnchant: 10, result: "success", chance: 3.3333333 },
    { result: "keep", chance: 30 },
    { result: "destroy", chance: 66.6666667 },
  ],
  10: [
    { nextEnchant: 11, result: "success", chance: 3.030303 },
    { result: "keep", chance: 30.3030303 },
    { result: "destroy", chance: 66.6666667 },
  ],
  11: [
    { nextEnchant: 12, result: "success", chance: 2.7777778 },
    { result: "keep", chance: 30.5555556 },
    { result: "destroy", chance: 66.6666667 },
  ],
};

// 일반 갑옷 마법 주문서 확률
const ARMOR_SCROLL_2_RATES: Record<
  number,
  {
    success: number;
    keep?: number;
    destroy: number;
  }
> = {
  4: { success: 25, destroy: 75 },
  5: { success: 20, destroy: 80 },
  6: { success: 16.6666667, destroy: 83.3333333 },
  7: { success: 14.2857143, destroy: 85.7142857 },
  8: { success: 12.5, destroy: 87.5 },
  9: { success: 0.3003003, keep: 10.8108108, destroy: 88.8888889 },
  10: { success: 0.2439024, keep: 9.7560976, destroy: 90 },
  11: { success: 0.2020202, keep: 8.8888889, destroy: 90.9090909 },
};

const ARMOR_SCROLL_55_RATES_BY_SAFE: Record<
  number,
  Record<
    number,
    Array<{
      nextEnchant?: number;
      result: "success" | "keep" | "destroy";
      chance: number;
    }>
  >
> = {
  4: {
    0: [
      { nextEnchant: 1, result: "success", chance: 33.3333333 },
      { nextEnchant: 2, result: "success", chance: 33.3333333 },
      { nextEnchant: 3, result: "success", chance: 33.3333333 },
    ],
    1: [
      { nextEnchant: 2, result: "success", chance: 33.3333333 },
      { nextEnchant: 3, result: "success", chance: 33.3333333 },
      { nextEnchant: 4, result: "success", chance: 33.3333333 },
    ],
    2: [
      { nextEnchant: 3, result: "success", chance: 33.3333333 },
      { nextEnchant: 4, result: "success", chance: 33.3333333 },
      { nextEnchant: 5, result: "success", chance: 33.3333333 },
    ],
    3: [
      { nextEnchant: 4, result: "success", chance: 50 },
      { nextEnchant: 5, result: "success", chance: 50 },
    ],
    4: [
      { nextEnchant: 5, result: "success", chance: 12.5 },
      { nextEnchant: 6, result: "success", chance: 12.5 },
      { result: "destroy", chance: 75 },
    ],
    5: [
      { nextEnchant: 6, result: "success", chance: 10 },
      { nextEnchant: 7, result: "success", chance: 10 },
      { result: "destroy", chance: 80 },
    ],
    6: [
      { nextEnchant: 7, result: "success", chance: 16.6666667 },
      { result: "destroy", chance: 83.3333333 },
    ],
    7: [
      { nextEnchant: 8, result: "success", chance: 14.2857143 },
      { result: "destroy", chance: 85.7142857 },
    ],
    8: [
      { nextEnchant: 9, result: "success", chance: 12.5 },
      { result: "destroy", chance: 87.5 },
    ],
    9: [
      { nextEnchant: 10, result: "success", chance: 1.1111111 },
      { result: "keep", chance: 10 },
      { result: "destroy", chance: 88.8888889 },
    ],
    10: [
      { nextEnchant: 11, result: "success", chance: 0.9090909 },
      { result: "keep", chance: 9.0909091 },
      { result: "destroy", chance: 90 },
    ],
    11: [
      { nextEnchant: 12, result: "success", chance: 0.7575758 },
      { result: "keep", chance: 8.3333333 },
      { result: "destroy", chance: 90.9090909 },
    ],
  },

  6: {
    0: [
      { nextEnchant: 1, result: "success", chance: 33.3333333 },
      { nextEnchant: 2, result: "success", chance: 33.3333333 },
      { nextEnchant: 3, result: "success", chance: 33.3333333 },
    ],
    1: [
      { nextEnchant: 2, result: "success", chance: 33.3333333 },
      { nextEnchant: 3, result: "success", chance: 33.3333333 },
      { nextEnchant: 4, result: "success", chance: 33.3333333 },
    ],
    2: [
      { nextEnchant: 3, result: "success", chance: 33.3333333 },
      { nextEnchant: 4, result: "success", chance: 33.3333333 },
      { nextEnchant: 5, result: "success", chance: 33.3333333 },
    ],
    3: [
      { nextEnchant: 4, result: "success", chance: 50 },
      { nextEnchant: 5, result: "success", chance: 50 },
    ],
    4: [
      { nextEnchant: 5, result: "success", chance: 50 },
      { nextEnchant: 6, result: "success", chance: 50 },
    ],
    5: [
      { nextEnchant: 6, result: "success", chance: 50 },
      { nextEnchant: 7, result: "success", chance: 50 },
    ],
    6: [
      { nextEnchant: 7, result: "success", chance: 16.6666667 },
      { result: "destroy", chance: 83.3333333 },
    ],
    7: [
      { nextEnchant: 8, result: "success", chance: 14.2857143 },
      { result: "destroy", chance: 85.7142857 },
    ],
    8: [
      { nextEnchant: 9, result: "success", chance: 12.5 },
      { result: "destroy", chance: 87.5 },
    ],
    9: [
      { nextEnchant: 10, result: "success", chance: 1.1111111 },
      { result: "keep", chance: 10 },
      { result: "destroy", chance: 88.8888889 },
    ],
    10: [
      { nextEnchant: 11, result: "success", chance: 0.9090909 },
      { result: "keep", chance: 9.0909091 },
      { result: "destroy", chance: 90 },
    ],
    11: [
      { nextEnchant: 12, result: "success", chance: 0.7575758 },
      { result: "keep", chance: 8.3333333 },
      { result: "destroy", chance: 90.9090909 },
    ],
  },
};

type ChatMessageType = {
  type: "chat" | "sys";
  message: string;
};

type DisplayProps = {
  displayData: DisplayData;
  setCurrentInvenData: React.Dispatch<React.SetStateAction<(any | null)[]>>;
  isReset: boolean;
};

const Display = ({
  displayData,
  isReset,
  setCurrentInvenData,
}: DisplayProps) => {
  const [isInvenOpen, setIsInvenOpen] = useState<boolean>(true);
  const [isOnItemIdx, setIsOnItemIdx] = useState<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [invenList, setInvenList] = useState<(any | null)[]>([]);
  const [pendingUseIndex, setPendingUseIndex] = useState<number | null>(null); // 더블클릭한 주문서 index
  const [chatMessage, setChatMessage] = useState<ChatMessageType[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [speechBubble, setSpeechBubble] = useState<string>("");
  const [speechBubbleTrigger, setSpeechBubbleTrigger] = useState<number>(0);
  const me: string = "리니지: ";
  const chatDisplayRef = useRef<HTMLDivElement | null>(null);
  const [isAutoScroll, setIsAutoScroll] = useState(true);

  useEffect(() => {
    setCurrentInvenData(invenList);
  }, [invenList, setCurrentInvenData]);

  useEffect(() => {
    setChatMessage([]);
  }, [isReset]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSpeechBubble("");
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [speechBubbleTrigger]);

  useEffect(() => {
    if (!isAutoScroll) return;

    const el = chatDisplayRef.current;
    if (!el) return;

    el.scrollTop = el.scrollHeight;
  }, [chatMessage, isAutoScroll]);

  const handleScroll = () => {
    const el = chatDisplayRef.current;
    if (!el) return;

    const threshold = 30;
    const isBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;

    setIsAutoScroll(isBottom);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "i" || e.key === "I") {
        setIsInvenOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const addSysMessage = (message: string) => {
    setChatMessage((prev) => [...prev, { type: "sys", message }]);
  };

  const addChatMessage = (message: string) => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    setChatMessage((prev) => [
      ...prev,
      { type: "chat", message: me + trimmedMessage },
    ]);
  };

  const handleSendChat = () => {
    if (!inputValue.trim()) return;

    addChatMessage(inputValue);
    setSpeechBubble(me + inputValue);
    setSpeechBubbleTrigger((prev) => prev + 1);
    setInputValue("");
  };

  const getIga = (word: string) => {
    const lastChar = word[word.length - 1];
    const code = lastChar.charCodeAt(0);

    // 한글 범위
    if (code < 0xac00 || code > 0xd7a3) return "이";

    const hasBatchim = (code - 0xac00) % 28 !== 0;
    return hasBatchim ? "이" : "가";
  };

  const expandedDisplayData = useMemo(() => {
    return displayData.flatMap((item, itemIdx) =>
      Array.from({ length: item.count }, (_, countIdx) => ({
        ...item,
        renderKey: `${item.id}-${itemIdx}-${countIdx}`,
      })),
    );
  }, [displayData]);

  useEffect(() => {
    const nextList = [
      ...expandedDisplayData,
      ...Array.from(
        { length: Math.max(0, 32 - expandedDisplayData.length) },
        () => null,
      ),
    ];

    setInvenList(nextList);
  }, [expandedDisplayData]);

  const getDetailObj = (detail?: Array<Record<string, any>>) => {
    if (!detail) return {};
    return Object.assign({}, ...detail);
  };

  const updateCurrentEnchantDetail = (detail?: Array<Record<string, any>>) => {
    const nextDetail = Array.isArray(detail) ? [...detail] : [];
    const currentEnchantIndex = nextDetail.findIndex(
      (d) => d && typeof d === "object" && "current_enchant" in d,
    );

    if (currentEnchantIndex >= 0) {
      const currentValue = Number(
        nextDetail[currentEnchantIndex].current_enchant ?? 0,
      );
      nextDetail[currentEnchantIndex] = {
        ...nextDetail[currentEnchantIndex],
        current_enchant: currentValue + 1,
      };
    } else {
      nextDetail.push({ current_enchant: 1 });
    }

    return nextDetail;
  };

  const setCurrentEnchantDetail = (
    detail?: Array<Record<string, any>>,
    nextEnchant?: number,
  ) => {
    const nextDetail = Array.isArray(detail) ? [...detail] : [];

    const currentEnchantIndex = nextDetail.findIndex(
      (d) => d && typeof d === "object" && "current_enchant" in d,
    );

    if (currentEnchantIndex >= 0) {
      nextDetail[currentEnchantIndex] = {
        ...nextDetail[currentEnchantIndex],
        current_enchant: nextEnchant ?? 0,
      };
    } else {
      nextDetail.push({ current_enchant: nextEnchant ?? 0 });
    }

    return nextDetail;
  };

  const handleItemDoubleClick = (idx: number) => {
    const clickedItem = invenList[idx];
    if (!clickedItem) return;

    // 1,2,54,55만 더블클릭 사용 가능
    if (clickedItem.id in ENCHANT_SCROLL_MAP) {
      setPendingUseIndex(idx);
      setIsOnItemIdx(idx);
    }
    if (clickedItem.id === 1 || clickedItem.id === 54) {
      addSysMessage("인챈트: 강화 할 무기를 선택하세요.");
    } else if (clickedItem.id === 2 || clickedItem.id === 55) {
      addSysMessage("인챈트: 강화 할 갑옷을 선택하세요.");
    }
  };

  const rollPercent = () => Math.random() * 100;

  const getWeaponScroll1Result = (currentEnchant: number) => {
    const rate = WEAPON_SCROLL_1_RATES[currentEnchant];

    // 표에 없는 구간은 일단 안전구간 밖 추가 데이터 없음으로 처리
    if (!rate) {
      return "no_data" as const;
    }

    const roll = rollPercent();

    if (roll < rate.success) {
      return "success" as const;
    }

    if (rate.keep !== undefined && roll < rate.success + rate.keep) {
      return "keep" as const;
    }

    return "destroy" as const;
  };

  const getArmorScroll2Result = (currentEnchant: number) => {
    const rate = ARMOR_SCROLL_2_RATES[currentEnchant];

    if (!rate) {
      return "no_data" as const;
    }

    const roll = rollPercent();

    if (roll < rate.success) {
      return "success" as const;
    }

    if (rate.keep !== undefined && roll < rate.success + rate.keep) {
      return "keep" as const;
    }

    return "destroy" as const;
  };

  const getWeaponScroll54Result = (currentEnchant: number) => {
    const rates = WEAPON_SCROLL_54_RATES[currentEnchant];

    if (!rates || rates.length === 0) {
      return { result: "no_data" as const };
    }

    const roll = rollPercent();
    let acc = 0;

    for (const rate of rates) {
      acc += rate.chance;

      if (roll < acc) {
        return {
          result: rate.result,
          nextEnchant: rate.nextEnchant,
        };
      }
    }

    return { result: "no_data" as const };
  };

  const getArmorScroll55Result = (
    safeEnchant: number,
    currentEnchant: number,
  ) => {
    const safeRates = ARMOR_SCROLL_55_RATES_BY_SAFE[safeEnchant];

    if (!safeRates) {
      return { result: "no_data" as const };
    }

    const rates = safeRates[currentEnchant];

    if (!rates || rates.length === 0) {
      return { result: "no_data" as const };
    }

    const roll = rollPercent();
    let acc = 0;

    for (const rate of rates) {
      acc += rate.chance;

      if (roll < acc) {
        return {
          result: rate.result,
          nextEnchant: rate.nextEnchant,
        };
      }
    }

    return { result: "no_data" as const };
  };

  console.log(invenList);
  const applyEnchantScroll = (targetIdx: number) => {
    if (pendingUseIndex === null) return;

    const scrollItem = invenList[pendingUseIndex];
    const targetItem = invenList[targetIdx];

    if (!scrollItem || !targetItem) return;

    // 주문서끼리 사용 불가
    if (targetItem.id in ENCHANT_SCROLL_MAP) {
      addSysMessage("아무일도 일어나지 않았습니다.");
      setPendingUseIndex(null);
      setIsOnItemIdx(targetIdx);
      return;
    }

    const allowedType = ENCHANT_SCROLL_MAP[scrollItem.id];

    // 타입 불일치
    if (targetItem.type !== allowedType) {
      addSysMessage("아무일도 일어나지 않았습니다.");
      setPendingUseIndex(null);
      setIsOnItemIdx(targetIdx);
      return;
    }

    const detailObj = getDetailObj(targetItem.detail);
    const currentEnchant = Number(detailObj.current_enchant ?? 0);
    const safeEnchant = Number(targetItem.safe_enchant ?? 0);

    // itemId:1 전용 로직
    if (scrollItem.id === 1) {
      // safe_enchant 미만까지는 무조건 성공
      if (currentEnchant < safeEnchant) {
        setInvenList((prev) => {
          const next = [...prev];
          const currentTarget = next[targetIdx];

          if (!currentTarget) return prev;

          next[targetIdx] = {
            ...currentTarget,
            detail: updateCurrentEnchantDetail(currentTarget.detail),
          };

          return next;
        });

        addSysMessage(
          `인챈트: +${currentEnchant} ${targetItem.name}${getIga(targetItem.name)} 한 순간 파랗게 빛납니다.`,
        );
        setPendingUseIndex(null);
        setIsOnItemIdx(targetIdx);
        return;
      }

      // safe_enchant 이상부터는 확률 적용
      const result = getWeaponScroll1Result(currentEnchant);

      if (result === "success") {
        setInvenList((prev) => {
          const next = [...prev];
          const currentTarget = next[targetIdx];

          if (!currentTarget) return prev;

          next[targetIdx] = {
            ...currentTarget,
            detail: updateCurrentEnchantDetail(currentTarget.detail),
          };

          return next;
        });

        addSysMessage(
          `인챈트: +${currentEnchant} ${targetItem.name}${getIga(targetItem.name)} 한 순간 파랗게 빛납니다.`,
        );
        setPendingUseIndex(null);
        setIsOnItemIdx(targetIdx);
        return;
      }

      if (result === "keep") {
        addSysMessage("아무일도 일어나지 않았습니다.");
        setPendingUseIndex(null);
        setIsOnItemIdx(targetIdx);
        return;
      }

      if (result === "destroy") {
        setInvenList((prev) => {
          const removedList = prev.filter((_, idx) => idx !== targetIdx);
          const next = [
            ...removedList,
            ...Array.from(
              { length: Math.max(0, 32 - removedList.length) },
              () => null,
            ),
          ];

          return next;
        });

        addSysMessage(
          `인챈트: +${currentEnchant} ${targetItem.name}${getIga(targetItem.name)} 잠시 강렬하게 파랗게 빛나더니 증발하여 사라졌습니다.`,
        );
        setPendingUseIndex(null);
        setIsOnItemIdx(null);
        return;
      }

      // 표에 없는 강화 구간
      addSysMessage("아무일도 일어나지 않았습니다.");
      setPendingUseIndex(null);
      setIsOnItemIdx(targetIdx);
      return;
    }

    if (scrollItem.id === 54) {
      const resultData = getWeaponScroll54Result(currentEnchant);

      if (resultData.result === "success") {
        setInvenList((prev) => {
          const next = [...prev];
          const currentTarget = next[targetIdx];

          if (!currentTarget) return prev;

          next[targetIdx] = {
            ...currentTarget,
            detail: setCurrentEnchantDetail(
              currentTarget.detail,
              resultData.nextEnchant,
            ),
          };

          return next;
        });
        addSysMessage(
          `인챈트: +${currentEnchant} ${targetItem.name}${getIga(targetItem.name)} 한 순간 파랗게 빛납니다.`,
        );
        setPendingUseIndex(null);
        setIsOnItemIdx(targetIdx);
        return;
      }

      if (resultData.result === "keep") {
        addSysMessage("아무일도 일어나지 않았습니다.");
        setPendingUseIndex(null);
        setIsOnItemIdx(targetIdx);
        return;
      }

      if (resultData.result === "destroy") {
        setInvenList((prev) => {
          const removedList = prev.filter((_, idx) => idx !== targetIdx);
          const next = [
            ...removedList,
            ...Array.from(
              { length: Math.max(0, 32 - removedList.length) },
              () => null,
            ),
          ];

          return next;
        });

        addSysMessage(
          `인챈트: +${currentEnchant} ${targetItem.name}${getIga(targetItem.name)} 잠시 강렬하게 파랗게 빛나더니 증발하여 사라졌습니다.`,
        );
        setPendingUseIndex(null);
        setIsOnItemIdx(null);
        return;
      }

      addSysMessage("아무일도 일어나지 않았습니다.");
      setPendingUseIndex(null);
      setIsOnItemIdx(targetIdx);
      return;
    }

    if (scrollItem.id === 2) {
      // safe_enchant 미만까지는 무조건 성공
      if (currentEnchant < safeEnchant) {
        setInvenList((prev) => {
          const next = [...prev];
          const currentTarget = next[targetIdx];

          if (!currentTarget) return prev;

          next[targetIdx] = {
            ...currentTarget,
            detail: updateCurrentEnchantDetail(currentTarget.detail),
          };

          return next;
        });

        addSysMessage(
          `인챈트: +${currentEnchant} ${targetItem.name}${getIga(targetItem.name)} 한 순간 은색으로 빛납니다.`,
        );
        setPendingUseIndex(null);
        setIsOnItemIdx(targetIdx);
        return;
      }

      // safe_enchant 이상부터는 확률 적용
      const result = getArmorScroll2Result(currentEnchant);

      if (result === "success") {
        setInvenList((prev) => {
          const next = [...prev];
          const currentTarget = next[targetIdx];

          if (!currentTarget) return prev;

          next[targetIdx] = {
            ...currentTarget,
            detail: updateCurrentEnchantDetail(currentTarget.detail),
          };

          return next;
        });

        addSysMessage(
          `인챈트: +${currentEnchant} ${targetItem.name}${getIga(targetItem.name)} 한 순간 은색으로 빛납니다.`,
        );
        setPendingUseIndex(null);
        setIsOnItemIdx(targetIdx);
        return;
      }

      if (result === "keep") {
        addSysMessage("아무일도 일어나지 않았습니다.");
        setPendingUseIndex(null);
        setIsOnItemIdx(targetIdx);
        return;
      }

      if (result === "destroy") {
        setInvenList((prev) => {
          const removedList = prev.filter((_, idx) => idx !== targetIdx);
          const next = [
            ...removedList,
            ...Array.from(
              { length: Math.max(0, 32 - removedList.length) },
              () => null,
            ),
          ];

          return next;
        });

        addSysMessage(
          `인챈트: +${currentEnchant} ${targetItem.name}${getIga(targetItem.name)} 잠시 강렬하게 은색으로 빛나더니 증발하여 사라졌습니다.`,
        );
        setPendingUseIndex(null);
        setIsOnItemIdx(null);
        return;
      }

      addSysMessage("아무일도 일어나지 않았습니다.");
      setPendingUseIndex(null);
      setIsOnItemIdx(targetIdx);
      return;
    }

    if (scrollItem.id === 55) {
      const resultData = getArmorScroll55Result(safeEnchant, currentEnchant);

      if (resultData.result === "success") {
        setInvenList((prev) => {
          const next = [...prev];
          const currentTarget = next[targetIdx];

          if (!currentTarget) return prev;

          next[targetIdx] = {
            ...currentTarget,
            detail: setCurrentEnchantDetail(
              currentTarget.detail,
              resultData.nextEnchant,
            ),
          };

          return next;
        });

        addSysMessage(
          `인챈트: +${currentEnchant} ${targetItem.name}${getIga(targetItem.name)} 한 순간 은색으로 빛납니다.`,
        );
        setPendingUseIndex(null);
        setIsOnItemIdx(targetIdx);
        return;
      }

      if (resultData.result === "keep") {
        addSysMessage("아무일도 일어나지 않았습니다");
        setPendingUseIndex(null);
        setIsOnItemIdx(targetIdx);
        return;
      }

      if (resultData.result === "destroy") {
        setInvenList((prev) => {
          const removedList = prev.filter((_, idx) => idx !== targetIdx);
          const next = [
            ...removedList,
            ...Array.from(
              { length: Math.max(0, 32 - removedList.length) },
              () => null,
            ),
          ];

          return next;
        });

        addSysMessage(
          `인챈트: +${currentEnchant} ${targetItem.name}${getIga(targetItem.name)} 잠시 강렬하게 은색으로 빛나더니 증발하여 사라졌습니다.`,
        );
        setPendingUseIndex(null);
        setIsOnItemIdx(null);
        return;
      }

      addSysMessage("아무일도 일어나지 않았습니다.");
      setPendingUseIndex(null);
      setIsOnItemIdx(targetIdx);
      return;
    }

    // 그 외 주문서는 기존처럼 일단 +1
    setInvenList((prev) => {
      const next = [...prev];
      const currentTarget = next[targetIdx];

      if (!currentTarget) return prev;

      next[targetIdx] = {
        ...currentTarget,
        detail: updateCurrentEnchantDetail(currentTarget.detail),
      };

      return next;
    });

    setPendingUseIndex(null);
    setIsOnItemIdx(targetIdx);
  };

  const itemOnClick = (idx: number) => {
    // 주문서 사용 대기 상태면 대상 아이템 클릭 시 적용
    if (pendingUseIndex !== null) {
      applyEnchantScroll(idx);
      return;
    }

    setIsOnItemIdx(idx);
  };

  const renderItemDetail = (item: any) => {
    const detailObj = getDetailObj(item.detail);

    const currentEnchant = detailObj.current_enchant;
    const sDamage = detailObj.s_damage;
    const lDamage = detailObj.l_damage;
    const ac = detailObj.ac;
    const type = detailObj.type;
    const equipClass = detailObj.class;
    const option = detailObj.option;

    return (
      <>
        {sDamage !== undefined && lDamage !== undefined && (
          <li>
            타격치: {sDamage}
            {currentEnchant !== undefined ? `+${currentEnchant}` : ""}/{lDamage}
            {currentEnchant !== undefined ? `+${currentEnchant}` : ""}
          </li>
        )}
        {type === "two hand" && <li>양손 무기</li>}
        {ac !== undefined && (
          <li>
            AC {ac}
            {currentEnchant !== undefined ? `+${currentEnchant}` : ""}
          </li>
        )}
        {Array.isArray(option) && option.length > 0 && (
          <li>
            <ul>
              {option.map((v, idx) => (
                <li key={idx}>{v}.</li>
              ))}
            </ul>
          </li>
        )}
        {equipClass && <li>사용 가능: {equipClass}.</li>}
        <li
          style={{
            color: item.id === 54 || item.id === 55 ? "#eeebbb" : "#fff",
          }}
        >
          재질: {item.texture}.
        </li>
        <li
          style={{
            color: item.id === 54 || item.id === 55 ? "#eeebbb" : "#fff",
          }}
        >
          무게: {item.weight}.
        </li>
      </>
    );
  };

  const handleDragStart = (idx: number) => {
    setDragIndex(idx);
  };

  const handleDrop = (dropIndex: number) => {
    if (dragIndex === null || dragIndex === dropIndex) return;

    setInvenList((prev) => {
      const next = [...prev];
      const temp = next[dragIndex];
      next[dragIndex] = next[dropIndex];
      next[dropIndex] = temp;
      return next;
    });

    if (isOnItemIdx === dragIndex) {
      setIsOnItemIdx(dropIndex);
    } else if (isOnItemIdx === dropIndex) {
      setIsOnItemIdx(dragIndex);
    }

    if (pendingUseIndex === dragIndex) {
      setPendingUseIndex(dropIndex);
    } else if (pendingUseIndex === dropIndex) {
      setPendingUseIndex(dragIndex);
    }

    setDragIndex(null);
  };

  return (
    <div className={styles.display_container}>
      <div className={styles.display_background}>
        <Image className={styles.bg_image} src={background} alt="Background" />
        <div className={styles.speech_bubble}>
          {speechBubble && <p>{speechBubble}</p>}
        </div>
        <div
          className={`${styles.display_right_ui} ${isInvenOpen ? styles.inven_open : ""}`}
        >
          <Image src={rightUI} alt="Right UI" />
          <div className={styles.inven_container}>
            <ul className={styles.inven_list}>
              {invenList.map((item, idx) => {
                if (!item) {
                  return (
                    <li
                      key={`empty-${idx}`}
                      className={`${styles.inven_item} ${styles.empty_slot}`}
                      style={{
                        cursor:
                          pendingUseIndex !== null ? "zoom-in" : "pointer",
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleDrop(idx)}
                    />
                  );
                }

                const detailObj = getDetailObj(item.detail);
                const isPendingScroll = pendingUseIndex === idx;

                return (
                  <li
                    key={item.renderKey}
                    className={`${styles.inven_item} ${isOnItemIdx === idx ? styles.inven_item_on : ""} ${isPendingScroll ? styles.pending_scroll : ""}`}
                    style={{
                      cursor: pendingUseIndex !== null ? "zoom-in" : "pointer",
                    }}
                    onClick={() => itemOnClick(idx)}
                    onDoubleClick={() => handleItemDoubleClick(idx)}
                    draggable
                    onDragStart={() => handleDragStart(idx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(idx)}
                  >
                    <Image
                      src={item.icon}
                      alt={item.name}
                      width={45}
                      height={45}
                    />
                    <span
                      className={`${styles.inven_item_name} ${isOnItemIdx !== idx ? styles.inven_item_name_on : ""}`}
                      style={{
                        color:
                          item.id === 54 || item.id === 55 ? "#eeebbb" : "#fff",
                      }}
                    >
                      {detailObj.current_enchant !== undefined
                        ? `+${detailObj.current_enchant} ${item.name}`
                        : item.name}
                    </span>

                    <div
                      className={`${styles.inven_item_detail} ${isOnItemIdx === idx ? styles.inven_item_detail_on : ""}`}
                    >
                      <ul>
                        <li
                          style={{
                            color:
                              item.id === 54 || item.id === 55
                                ? "#eeebbb"
                                : "#fff",
                          }}
                        >
                          {detailObj.current_enchant !== undefined
                            ? `+${detailObj.current_enchant} ${item.name}`
                            : item.name}
                        </li>
                        {isOnItemIdx === idx && renderItemDetail(item)}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className={styles.display_bottom_ui}>
          <Image src={bottomUI} alt="Bottom UI" />
          <div className={styles.chat_container}>
            <div className={styles.chat_content}>
              <div
                ref={chatDisplayRef}
                className={styles.chat_display}
                onScroll={handleScroll}
              >
                {chatMessage.map((item, idx) => (
                  <p
                    key={idx}
                    className={
                      item.type === "sys" ? styles.chat_sys : styles.chat_text
                    }
                  >
                    {item.message}
                  </p>
                ))}

                <div ref={chatEndRef} />
              </div>
              <div className={styles.chat_input}>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendChat();
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Display;
