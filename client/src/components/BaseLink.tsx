import React from 'react';

type Props = {
  title: string;
  icon?: string;
  width?: string;
  size?: 'sm' | 'base' | 'lg';
  status?: 'open' | 'close';
  pointer?: boolean;
  className?: string;
  link?: string;
};

const BaseLink = (props: Props) => {
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
    <a href={props.link} target='_blank' title={props.title} className={`flex items-center overflow-hidden ${props.className}`}>
      <img src={props.icon ? props.icon : 'https://www.google.com/favicon.ico'} className={`mx-1 select-none ${imgSizeHandler()}`} />
      <span className={`select-none overflow-hidden truncate whitespace-nowrap ${titleSizeHandler()}`}>{props.title}</span>
    </a>
  );
};

export default BaseLink;
