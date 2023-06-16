import React, { useEffect, useRef } from 'react';
import { MdChevronRight, MdExpandMore } from 'react-icons/md';

type Props = {
  id: number;
  title: string;
  icon?: string;
  width?: string;
  size?: 'sm' | 'base' | 'lg';
  status?: 'open' | 'close';
  pointer?: boolean;
  className?: string;
  onClick?: (event: MouseEvent) => void;
};

const BaseFolder = (props: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    props.onClick && ref.current?.addEventListener('click', props.onClick!, false);
    return () => {
      props.onClick && ref.current?.removeEventListener('click', props.onClick!);
    };
  });

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
    <div ref={ref} title={props.title} className={`flex items-center overflow-hidden ${props.className}`}>
      {switchFolderStatus()}
      <img src={props.icon ? props.icon : 'https://www.google.com/favicon.ico'} className={`mx-1 select-none ${imgSizeHandler()}`} />

      <span className={`select-none overflow-hidden truncate whitespace-nowrap ${titleSizeHandler()}`}>{props.title}</span>
    </div>
  );
};

export default BaseFolder;
