import React, { ReactNode, useEffect, useRef, useState } from "react";

type PropsType = {
  name: string;
  contents?: string[];
};

export const AccordionMenu = ({ name, contents }: PropsType) => {
  const childElement = useRef<HTMLDivElement>(null);
  const [showChildren, setShowChildren] = useState(false);
  const [childHeight, setChildHeight] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (childElement.current) {
      const height = childElement.current?.clientHeight;
      setChildHeight(height);
    }
  }, []);

  const handleClick = () => {
    if (childElement.current) {
      setIsOpen(true);
      if (isOpen == true) {
        setIsOpen(false);
      }
    }
  };

  //配列の表示
  const SetArticle = () => {
    if (isOpen == false) {
      null;
    } else if (isOpen == true)
      return (
        <div>
          {contents?.map((article) => {
            return <p>{article}</p>;
          })}
        </div>
      );
  };

  return (
    <>
      <button
        onClick={handleClick}
        className=" border-0 border-solid border-gray-300 bg-red-400"
      >
        <span
          ref={childElement}
          className={showChildren ? "isOpen" : "isClose"}
        >
          {name}
        </span>
      </button>
      <SetArticle />
    </>
  );
};
