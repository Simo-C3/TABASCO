import React, { ReactNode, useEffect, useRef, useState } from "react";

type PropsType = {
  name: string;
  contents?: string[];
};

export const AccordionMenu = ({ name, contents }: PropsType) => {
  const [showChildren, setShowChildren] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  //配列の表示
  const SetArticle = () => {
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
        <span className={showChildren ? "isOpen" : "isClose"}>{name}</span>
      </button>
      {isOpen && <SetArticle />}
    </>
  );
};
