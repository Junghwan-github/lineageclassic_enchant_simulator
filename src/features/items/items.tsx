"use client";
import styles from "./items.module.css";
import { useEffect, useRef, useState } from "react";
import { getItems, Item } from "@/features/items/api/get-items";
import { MdKeyboardArrowDown } from "react-icons/md";
import Image from "next/image";
import { RiResetRightFill } from "react-icons/ri";
import { GoXCircle } from "react-icons/go";
import { getItemsByIds } from "@/features/items/api/get-items";
import { DisplayData, DisplayItem } from "@/widgets/content/content";
import { GoQuestion } from "react-icons/go";
import { Modal } from "@/shared/ui/modal";
import { IoMdClose } from "react-icons/io";

type SelectedItem = {
  id: number;
  name: string;
  icon: string;
  count: number;
};

type ItemData = {
  weapon: SelectedItem[];
  armor: SelectedItem[];
};

type ItemDataProps = {
  itemData: ItemData;
  setItemData: React.Dispatch<React.SetStateAction<ItemData>>;
  displayData: DisplayData;
  setDisplayData: React.Dispatch<React.SetStateAction<DisplayData>>;
  setIsReset: React.Dispatch<React.SetStateAction<boolean>>;
  currentInvenData: (DisplayItem | null)[];
};

const Items = ({
  itemData,
  setItemData,
  displayData,
  setDisplayData,
  setIsReset,
  currentInvenData,
}: ItemDataProps) => {
  const [items, setItems] = useState<Item[]>([]);
  const [itemListOpen, setItemListOpen] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedWeaponId, setSelectedWeaponId] = useState<{
    id: number;
    name: string;
    icon: string;
  } | null>(null);
  const [selectedArmorId, setSelectedArmorId] = useState<{
    id: number;
    name: string;
    icon: string;
  } | null>(null);

  const [isShowMessage, setIsShowMessage] = useState<boolean>(false);
  const [errorTrigger, setErrorTrigger] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const listRef = useRef<HTMLUListElement | null>(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getItems();
        setItems(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const itemLists = document.querySelectorAll(`.${styles.item_list}`);
      const isClickInside = Array.from(itemLists).some((list) =>
        list.contains(target),
      );

      if (!isClickInside) {
        setItemListOpen("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!errorMessage) return;

    setIsShowMessage(true);

    const messageTimer = setTimeout(() => {
      setIsShowMessage(false);
    }, 2000);

    return () => clearTimeout(messageTimer);
  }, [errorMessage, errorTrigger]);

  const handleWheel = (e: React.WheelEvent<HTMLUListElement>) => {
    const el = listRef.current;
    if (!el) return;

    const isScrollable = el.scrollWidth > el.clientWidth;
    if (!isScrollable) return;

    e.preventDefault();
    el.scrollLeft += e.deltaY;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLUListElement>) => {
    const el = listRef.current;
    if (!el) return;

    isDownRef.current = true;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLUListElement>) => {
    const el = listRef.current;
    if (!el || !isDownRef.current) return;

    e.preventDefault();

    const x = e.pageX - el.offsetLeft;
    const walk = x - startXRef.current;
    el.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    isDownRef.current = false;
  };

  const handleMouseLeave = () => {
    isDownRef.current = false;
  };

  const getTotalCount = (data: ItemData) => {
    return (
      data.weapon.reduce((sum, v) => sum + v.count, 0) +
      data.armor.reduce((sum, v) => sum + v.count, 0)
    );
  };

  const handleWeaponSelect = (itemId: number, name: string, icon: string) => {
    if (isShowMessage) {
      setIsShowMessage(false);
    }
    setSelectedWeaponId({ id: itemId, name: name, icon: icon });
    setItemListOpen("");
    setErrorMessage("");
  };

  const handleWeaponCountSelect = (count: number) => {
    if (selectedWeaponId === null) {
      setErrorMessage("무기를 먼저 선택해 주세요");
      setErrorTrigger((prev) => prev + 1);
      return;
    }

    const total = getTotalCount(itemData);

    if (total + count > 28) {
      setErrorMessage("최대 28개까지만 선택할 수 있습니다");
      setErrorTrigger((prev) => prev + 1);
      return;
    }

    setItemData((prev) => ({
      ...prev,
      weapon: [
        ...prev.weapon,
        {
          id: selectedWeaponId.id,
          icon: selectedWeaponId.icon,
          name: selectedWeaponId.name,
          count,
        },
      ],
    }));

    setSelectedWeaponId(null);
    setItemListOpen("");
    setErrorMessage("");
  };

  const handleArmorSelect = (itemId: number, name: string, icon: string) => {
    if (isShowMessage) {
      setIsShowMessage(false);
    }
    setSelectedArmorId({ id: itemId, name: name, icon: icon });
    setItemListOpen("");
    setErrorMessage("");
  };

  const handleArmorCountSelect = (count: number) => {
    if (selectedArmorId === null) {
      setErrorMessage("방어구를 먼저 선택해 주세요");
      setErrorTrigger((prev) => prev + 1);
      return;
    }

    const total = getTotalCount(itemData);

    if (total + count > 28) {
      setErrorMessage("최대 28개까지만 선택할 수 있습니다");
      setErrorTrigger((prev) => prev + 1);
      return;
    }

    setItemData((prev) => ({
      ...prev,
      armor: [
        ...prev.armor,
        {
          id: selectedArmorId.id,
          icon: selectedArmorId.icon,
          name: selectedArmorId.name,
          count,
        },
      ],
    }));

    setSelectedArmorId(null);
    setItemListOpen("");
    setErrorMessage("");
  };

  const toggleItemList = (type: string) => {
    if (isShowMessage) {
      setIsShowMessage(false);
    }

    if (
      (type === "weapon_count" && selectedWeaponId === null) ||
      (type === "armor_count" && selectedArmorId === null)
    ) {
      setErrorMessage("무기 또는 방어구를 먼저 선택해 주세요");
      setErrorTrigger((prev) => prev + 1);
    } else {
      setErrorMessage("");
    }

    setItemListOpen((prev) => (prev === type ? "" : type));
  };

  const mergedItems = [
    ...itemData.weapon.map((v, i) => ({
      ...v,
      type: "weapon" as const,
      originalIndex: i,
    })),
    ...itemData.armor.map((v, i) => ({
      ...v,
      type: "armor" as const,
      originalIndex: i,
    })),
  ];

  const handleRemoveItem = (type: "weapon" | "armor", idx: number) => {
    setItemData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== idx),
    }));
  };

  const handleAllReset = () => {
    setItemData({ weapon: [], armor: [] });
    setDisplayData([]);
    setSelectedWeaponId(null);
    setSelectedArmorId(null);
    setIsReset((prev) => !prev);
  };

  const handleSubmit = async () => {
    try {
      const selectedItems = [...itemData.weapon, ...itemData.armor];

      if (selectedItems.length === 0) {
        setErrorMessage("선택한 아이템이 없습니다");
        setErrorTrigger((prev) => prev + 1);
        return;
      }

      const existingItems = currentInvenData
        .filter((item): item is DisplayItem => item !== null)
        .map((item) => ({
          ...item,
          count: 1,
        }));

      const existingIds = existingItems.map((item) => item.id);
      const selectedIds = selectedItems.map((item) => item.id);

      const fixedItems = [
        !selectedIds.includes(1) && !existingIds.includes(1)
          ? { id: 1, count: 1 }
          : null,
        !selectedIds.includes(54) && !existingIds.includes(54)
          ? { id: 54, count: 1 }
          : null,
        !selectedIds.includes(2) && !existingIds.includes(2)
          ? { id: 2, count: 1 }
          : null,
        !selectedIds.includes(55) && !existingIds.includes(55)
          ? { id: 55, count: 1 }
          : null,
      ].filter((item): item is { id: number; count: number } => item !== null);

      const itemIds = [
        ...new Set([
          ...selectedItems.map((item) => item.id),
          ...fixedItems.map((item) => item.id),
        ]),
      ];

      const data = await getItemsByIds(itemIds);

      const newDisplayData = [
        ...selectedItems
          .map((selectedItem) => {
            const matchedItem = data.find(
              (item) => item.id === selectedItem.id,
            );

            if (!matchedItem) return null;

            return {
              ...matchedItem,
              count: selectedItem.count,
            };
          })
          .filter((item): item is DisplayItem => item !== null),

        ...fixedItems
          .map((fixedItem) => {
            const matchedItem = data.find((item) => item.id === fixedItem.id);

            if (!matchedItem) return null;

            return {
              ...matchedItem,
              count: fixedItem.count,
            };
          })
          .filter((item): item is DisplayItem => item !== null),
      ];

      const mergedData = [...existingItems, ...newDisplayData];

      setDisplayData(mergedData);
      setItemData({ weapon: [], armor: [] });
    } catch (error) {
      console.error(error);
      setErrorMessage("아이템 정보를 불러오지 못했습니다");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.current_item_list}>
        <div className={styles.desc}>
          <span>선택한 아이템 목록</span>
          <button type="button" onClick={() => setModalOpen(true)}>
            <GoQuestion size={15} />
            사용법
          </button>
          <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
            <div className={styles.manual_container}>
              <div className={styles.manual_header}>
                <button type="button" onClick={() => setModalOpen(false)}>
                  <IoMdClose size={25} />
                </button>
              </div>
              <div className={styles.manual_content}>
                <div className={styles.guide}>
                  <h2 className={styles.title}>사용 방법</h2>

                  <section className={styles.section}>
                    <p>
                      <strong>I 키</strong>를 눌러 인벤토리를 열고 닫을 수
                      있습니다.
                    </p>
                  </section>

                  <section className={styles.section}>
                    <h3>아이템 선택</h3>
                    <p>
                      무기 또는 방어구 목록에서 먼저 아이템을 선택한 후, 개수를
                      지정하면 상단의 <strong>선택된 아이템 목록</strong>에
                      아이템과 개수가 표시됩니다.
                    </p>
                    <p>
                      선택된 아이템은 <strong>X 버튼</strong>을 눌러 삭제할 수
                      있습니다.
                    </p>
                  </section>

                  <section className={styles.section}>
                    <h3>아이템 생성</h3>
                    <p>
                      선택이 완료되면{" "}
                      <span className={styles.highlight}>아이템 생성 버튼</span>
                      을 눌러 인벤토리에 아이템을 생성할 수 있습니다.
                    </p>
                    <p>
                      생성된 아이템은 <strong>드래그</strong>로 자유롭게 위치를
                      변경할 수 있습니다.
                    </p>
                  </section>

                  <section className={styles.section}>
                    <h3>강화(인챈트)</h3>
                    <p>
                      무기 마법 주문서 또는 갑옷 마법 주문서를{" "}
                      <strong>더블클릭</strong>한 후, 아이템에 사용하여 강화
                      시뮬레이션을 진행할 수 있습니다.
                    </p>
                    <p>
                      강화 결과는 채팅창에 실제 게임과 유사한 형태의
                      <strong>강화 로그</strong>로 출력됩니다.
                    </p>
                    <p>
                      채팅창에 직접 메시지를 입력하여 스크롤을 생성하면, 강화
                      결과를 일부러 가려보는 것도 가능합니다.
                    </p>
                  </section>

                  <section className={styles.section}>
                    <h3>버튼 설명</h3>
                    <ul className={styles.guide_list}>
                      <li>
                        <strong>무기 선택</strong> : 무기 목록 선택
                      </li>
                      <li>
                        <strong>무기 개수</strong> : 선택한 무기 수량 지정
                      </li>
                      <li>
                        <strong>방어구 선택</strong> : 방어구 목록 선택
                      </li>
                      <li>
                        <strong>방어구 개수</strong> : 선택한 방어구 수량 지정
                      </li>
                      <li>
                        <strong>초기화</strong> : 모든 선택 상태 초기화
                      </li>
                      <li>
                        <strong>아이템 생성</strong> : 선택한 아이템을
                        인벤토리에 생성
                      </li>
                    </ul>
                  </section>

                  <section className={styles.footer}>
                    <p>
                      실제 게임과 최대한 유사한 경험을 제공하기 위해 많은
                      디테일을 반영했습니다. <br /> 앞으로도 지속적인 업데이트를
                      통해 더욱 완성도를 높여갈 예정입니다.
                    </p>
                    <p>본 페이지는 1920 x 1080 해상도에 최적화되어 있습니다.</p>
                  </section>
                </div>
              </div>
            </div>
          </Modal>
        </div>
        <ul
          ref={listRef}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {mergedItems.map((item, idx) => (
            <li key={idx}>
              <div className={styles.current_item}>
                <span>
                  {item.name}({item.count})
                </span>
                <button
                  type="button"
                  className={styles.current_item_remove_btn}
                  onClick={() =>
                    handleRemoveItem(item.type, item.originalIndex)
                  }
                >
                  <GoXCircle size={15} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {isShowMessage && <p className={styles.message}>{errorMessage}</p>}
      <div className={styles.list_container}>
        <div className={`${styles.item} ${styles.weapon}`}>
          <div className={styles.list}>
            <button
              type="button"
              className={`${styles.list_btn} ${styles.weapon_btn}`}
              onClick={() => toggleItemList("weapon")}
            >
              {selectedWeaponId !== null ? (
                <div className={styles.selected_item}>
                  <Image
                    src={selectedWeaponId.icon}
                    alt={selectedWeaponId.name}
                    width={20}
                    height={20}
                  />
                  {selectedWeaponId?.name}
                </div>
              ) : (
                <>무기 선택</>
              )}
              <MdKeyboardArrowDown size={20} />
            </button>
            <ul
              className={`${styles.item_list} ${itemListOpen === "weapon" ? styles.open : ""}`}
            >
              {items
                .filter((item) => item.type === "weapon")
                .map((item) => (
                  <li
                    key={item.id}
                    onClick={() =>
                      handleWeaponSelect(item.id, item.name, item.icon)
                    }
                  >
                    <Image
                      src={item.icon}
                      alt={item.name}
                      width={22}
                      height={22}
                    />
                    {item.name}
                  </li>
                ))}
            </ul>
          </div>
          <div className={styles.count}>
            <button
              type="button"
              className={`${styles.list_btn} ${styles.count_btn}`}
              onClick={() => toggleItemList("weapon_count")}
            >
              개수
              <MdKeyboardArrowDown size={20} />
            </button>
            <ul
              className={`${styles.item_list} ${itemListOpen === "weapon_count" ? styles.open : ""}`}
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                <li key={num} onClick={() => handleWeaponCountSelect(num)}>
                  {num}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={`${styles.item} ${styles.armor}`}>
          <div className={styles.list}>
            <button
              type="button"
              className={`${styles.list_btn} ${styles.armor_btn}`}
              onClick={() => toggleItemList("armor")}
            >
              {selectedArmorId !== null ? (
                <div className={styles.selected_item}>
                  <Image
                    src={selectedArmorId.icon}
                    alt={selectedArmorId.name}
                    width={20}
                    height={20}
                  />
                  {selectedArmorId?.name}
                </div>
              ) : (
                <>방어구 선택</>
              )}
              <MdKeyboardArrowDown size={20} />
            </button>
            <ul
              className={`${styles.item_list} ${itemListOpen === "armor" ? styles.open : ""}`}
            >
              {items
                .filter((item) => item.type === "armor")
                .map((item) => (
                  <li
                    key={item.id}
                    onClick={() =>
                      handleArmorSelect(item.id, item.name, item.icon)
                    }
                  >
                    <Image
                      src={item.icon}
                      alt={item.name}
                      width={22}
                      height={22}
                    />
                    {item.name}
                  </li>
                ))}
            </ul>
          </div>
          <div className={styles.count}>
            <button
              type="button"
              className={`${styles.list_btn} ${styles.count_btn}`}
              onClick={() => toggleItemList("armor_count")}
            >
              개수
              <MdKeyboardArrowDown size={20} />
            </button>
            <ul
              className={`${styles.item_list} ${itemListOpen === "armor_count" ? styles.open : ""}`}
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                <li key={num} onClick={() => handleArmorCountSelect(num)}>
                  {num}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={styles.action_btns}>
          <button
            type="button"
            className={styles.reset}
            onClick={handleAllReset}
          >
            <RiResetRightFill size={15} />
            초기화
          </button>
          <button
            type="button"
            className={styles.submit}
            onClick={handleSubmit}
          >
            아이템 생성
          </button>
        </div>
      </div>
    </div>
  );
};

export default Items;
