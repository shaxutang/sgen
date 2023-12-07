import { Comp } from "@/type";
import { withInstall } from "@/utils/install";
import Button from "./button.vue";
import "./style.css";

Button.install = withInstall(Button);

export default Button as Comp<typeof Button>;

export * from "./type";
