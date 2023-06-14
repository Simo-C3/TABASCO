import React, { useState } from 'react';
import type { Bookmarks } from '../types';
import { RootId } from '../config';
import { Page } from './page';

type PropsType = {
  contents: Bookmarks;
};

export const AccordionMenu = ({ contents }: PropsType) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  //配列の表示
  const SetArticle = () => {
    return (
      <div className='pl-5'>
        {contents.children?.map((article) => {
          if (article.type === 'page') {
            return <Page contents={article} />;
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
      <button onClick={handleClick} className=' border-0 border-solid border-gray-300 bg-gray-200 text-lg'>
        <span className={isOpen ? 'isOpen' : 'isClose'}>{contents.title}</span>
      </button>
      {isOpen && <SetArticle />}
    </>
  );
};
