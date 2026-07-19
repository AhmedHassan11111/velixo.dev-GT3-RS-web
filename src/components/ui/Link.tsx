import React, { ReactNode, MouseEventHandler } from "react";

export function Link({ href, children, className, onClick, ...props }: { href: string; children: ReactNode; className?: string; onClick?: MouseEventHandler<HTMLAnchorElement>; [key: string]: any }) {
  return (
    <a href={href} className={className} onClick={onClick} {...props}>
      {children}
    </a>
  );
}
