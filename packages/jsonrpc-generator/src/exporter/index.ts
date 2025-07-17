import type { MethodType } from "../types";
import { exportMethods } from "./methods";

export function exporter(methods: MethodType[]) {
  const exportedMethods = exportMethods(methods);

  console.log(exportedMethods);
}
