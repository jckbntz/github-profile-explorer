import type { ReactNode } from "react";

interface Props {
  kind?: "info" | "loading" | "error";
  children: ReactNode;
}

function StatusMessage({ kind = "info", children }: Props) {
  return (
    <p className={`status status--${kind}`} role={kind === "error" ? "alert" : undefined}>
      {children}
    </p>
  );
}

export default StatusMessage;
