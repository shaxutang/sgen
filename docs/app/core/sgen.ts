import { Explore } from "../components/FileTree/explore";

export function isCreator(explore: Explore): boolean {
  return explore.getPath().startsWith("/project/.sgen/creator");
}

export function isGenerator(explore: Explore): boolean {
  return explore.getPath().startsWith("/project/.sgen/generator");
}
