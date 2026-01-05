import React from "react";

export function Card(props: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={"card " + (props.className ?? "")}>
      {props.children}
    </div>
  );
}