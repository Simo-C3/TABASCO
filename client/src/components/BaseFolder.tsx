import React from 'react';
import { MdChevronRight, MdExpandMore } from 'react-icons/md';

type Props = {
  title: string;
  icon: string;
  width?: string;
  size?: 'sm' | 'base' | 'lg';
  status?: 'open' | 'close';
};

const BaseFolder = (props: Props) => {
  const switchFolderStatus = () => {
    switch (props.status) {
      case 'open':
        return <MdExpandMore className='h-5 w-5' />;
      case 'close':
        return <MdChevronRight className='h-5 w-5' />;
      default:
        return;
    }
  };

  const imgSizeHandler = () => {
    switch (props.size) {
      case 'sm':
        return 'h-3 w-3';
      case 'base':
        return 'h-4 w-4';
      case 'lg':
        return 'h-5 w-5';
      default:
        return 'h-4 w-4';
    }
  };

  const titleSizeHandler = () => {
    switch (props.size) {
      case 'sm':
        return 'text-sm';
      case 'base':
        return 'text-base';
      case 'lg':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  return (
    <div className='flex items-center'>
      {switchFolderStatus()}
      <img src={props.icon ? props.icon : 'https://www.google.com/favicon.ico'} className={`mx-1 select-none ${imgSizeHandler()}`} />
      <span className={`select-none ${titleSizeHandler()}`}>{props.title}</span>
    </div>
  );
};

export default BaseFolder;
