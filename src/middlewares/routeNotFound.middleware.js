import { NotFoundException } from "../errors/index.js";

export const routeNotFound = (req, res) => {
  console.error("Route doesn't found");
  throw new NotFoundException("Route doesn't found");
};
