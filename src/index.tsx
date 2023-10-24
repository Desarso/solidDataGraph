/* @refresh reload */
import { render } from "solid-js/web";

import Main from "./modules/Main";

const root = document.getElementById("root");

render(() => <Main />, root!);
