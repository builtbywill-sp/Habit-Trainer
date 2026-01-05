import React from "react";

export function Layout({
  title,
  subtitle,
  rightAction,
  children,
}: React.PropsWithChildren<{
  title: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
}>) {
  return (
    <div className="screen">
      <div className="header">
        <div>
          <h1>{title}</h1>
          {subtitle && <p className="sub">{subtitle}</p>}
        </div>
        {rightAction && <div className="right">{rightAction}</div>}
      </div>
      {children}
    </div>
  );
}