import React, { ReactNode, useEffect, useRef, useState } from "react";

type PropsType = {
  name: string;
  children_: string[];
  children?: ReactNode;
};

export const AccordionMenu = ({ name, children_, children }: PropsType) => {
  const childElement = useRef<HTMLDivElement>(null);
  const [showChildren, setshowChildren] = useState(false);
  const [childHeight, setChildHeight] = useState(0);

  useEffect(() => {
    if (childElement.current) {
      const height = childElement.current?.clientHeight;
      setChildHeight(height);
    }
  }, []);

  // 高さの取得
  const handleClick = () => {
    if (childElement.current) {
      const childheight = childElement.current?.clientHeight;
      console.log("childheight:", childheight);
      alert("yaaaaaaaaaaaaaa!");
    }
    alert("hoge");
  };

  // const onClickAccordionToggle = () => {
  //   const sidebar = document.getElementById("tabasco-side-bar");
  //   setShowContents(!showContents);
  //   console.log("hegiht" + sidebar?.clientHeight);
  //   alert("yaaaaaaaaaaaaaa!" + sidebar?.clientHeight);
  // };

  return (
    <>
      <button
        onClick={handleClick}
        className=" border-0 border-solid border-gray-300 bg-red-400"
      >
        <span className={showChildren ? "isOpen" : "isClose"}>{name}</span>
      </button>
    </>
  );
};
