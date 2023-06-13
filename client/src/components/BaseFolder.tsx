import React from 'react';
import { MdChevronRight, MdExpandMore } from 'react-icons/md';

type Props = {
  title: string;
  icon: string;
  width?: string;
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

  return (
    <div className='flex items-center'>
      {switchFolderStatus()}
      <img src={props.icon ? props.icon : 'https://www.google.com/favicon.ico'} className='mx-1 h-5 w-5 select-none' />
      <span className='select-none text-lg'>{props.title}</span>
    </div>
  );
};

export default BaseFolder;
