"use client";
import Display from "@/features/display/display";
import Items from "@/features/items/items";
import styles from "./content.module.css";
import { useState } from "react";
import { Item } from "@/features/items/api/get-items";
import { SlExclamation } from "react-icons/sl";

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

export type DisplayItem = Item & {
  count: number;
};

export type DisplayData = DisplayItem[];

const Content = () => {
  const [itemData, setItemData] = useState<ItemData>({ weapon: [], armor: [] });
  const [displayData, setDisplayData] = useState<DisplayData>([]);
  const [currentInvenData, setCurrentInvenData] = useState<
    (DisplayItem | null)[]
  >([]);
  const [isReset, setIsReset] = useState<boolean>(false);

  return (
    <main className={styles.content}>
      <Items
        itemData={itemData}
        setItemData={setItemData}
        displayData={displayData}
        setDisplayData={setDisplayData}
        currentInvenData={currentInvenData}
        setIsReset={setIsReset}
      />
      <Display
        displayData={displayData}
        setCurrentInvenData={setCurrentInvenData}
        isReset={isReset}
      />
      <div className={styles.exclamation}>
        <SlExclamation size={20} />
        <p>
          본 페이지는 리니지 클래식 공식 홈페이지의 확률 정보를 참고하여 실제
          게임과 유사하게 구현한 비공식 시뮬레이터입니다. <br/> 실제 게임과는 일부
          차이가 있을 수 있습니다.
        </p>
      </div>
    </main>
  );
};

export default Content;
