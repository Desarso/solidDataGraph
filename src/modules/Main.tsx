import { onMount } from "solid-js";
import { DataTable } from "../classes/DataTable";
import "../styles.css";
import { DataManager } from "../classes/DataManager";
type Props = {};

declare global {
  interface Window {
    DataTable: typeof DataTable;
  }
}

function Main({}: Props) {
  onMount(() => {
    window.DataTable = DataTable;
    DataManager.constructorDataTable();
  });
  return (
    <>
      <div></div>
    </>
  );
}

export default Main;
