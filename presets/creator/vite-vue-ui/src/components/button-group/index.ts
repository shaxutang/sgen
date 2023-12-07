import { Comp } from "@/type";
import { withInstall } from "@/utils/install";
import ButtonGroup from "./button-group.vue";
import "./style.css";

ButtonGroup.install = withInstall(ButtonGroup);

export default ButtonGroup as Comp<typeof ButtonGroup>;

export * from "./type";
