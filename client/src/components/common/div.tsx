import React, { useCallback, useEffect, useRef } from 'react';

type Props = {
  id?: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: (e: MouseEvent) => void;
};
const Div = (props: Props) => {
  props.onClick = props.onClick && useCallback(props.onClick, []);
  return <Body {...props}>{props.children}</Body>;
};
const Body = React.memo(({ id, className, children, onClick }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onClick) ref.current?.addEventListener('click', onClick);
  }, []);

  return (
    <div ref={ref} id={id} className={className}>
      {children}
    </div>
  );
});

export default Div;
