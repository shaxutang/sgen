export {};

declare module "vue" {
  export interface GlobalComponents {
    VButton: (typeof import("<%= name %>"))["Button"];
    VButtonGroup: (typeof import("<%= name %>"))["ButtonGroup"];
  }
}
