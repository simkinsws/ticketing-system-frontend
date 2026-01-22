import { useEffect } from "react";
import { startSignalR } from "./signalR";

export function useSignalR() {
  useEffect(() => {
    startSignalR().catch(() => {});
  }, []);
}
