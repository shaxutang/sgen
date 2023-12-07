/**
 * you can exec "sgen vite-vue-ui" to generate a new component
 */
import { App } from "vue";
// import component
import Button from "./components/button";
import ButtonGroup from "./components/button-group";

export { Button, ButtonGroup };

export default {
  install(app: App) {
    // app use component
    app.use(Button);
    app.use(ButtonGroup);
  },
};
