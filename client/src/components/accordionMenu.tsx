import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { Bookmarks } from '../types';
import { RootId } from '../config';

type PropsType = {
  contents: Bookmarks;
};

export const AccordionMenu = ({ contents }: PropsType) => {
  const [showChildren, setShowChildren] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  //配列の表示
  const SetArticle = () => {
    return (
      <div>
        {contents.children?.map((article) => {
          if (article.type === 'page') {
            // TODO: <Page contents={article}/> みたいに
            return <p>{article.title}</p>;
          }
          return <AccordionMenu contents={article} />;
        })}
      </div>
    );
  };

  if (contents.id === RootId) {
    return <SetArticle />;
  }

  return (
    <>
      <button onClick={handleClick} className=' border-0 border-solid border-gray-300 bg-red-400'>
        <span className={showChildren ? 'isOpen' : 'isClose'}>{contents.title}</span>
      </button>
      {isOpen && <SetArticle />}
    </>
  );
};
