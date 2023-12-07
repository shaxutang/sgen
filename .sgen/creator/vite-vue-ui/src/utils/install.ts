import { App, Component } from "vue";

export function withInstall(c: Component) {
  return function (app: App) {
    app.component(c.name!, c);
  };
}
