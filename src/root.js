import { Jurol } from "./schema.js";

export const root = {
  getJurol({ name }) {
    return new Jurol(name || "Yolo");
  },
};
