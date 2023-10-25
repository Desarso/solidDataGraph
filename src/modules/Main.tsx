import { onMount } from "solid-js";
import { DataTable } from "../classes/DataTable";
import "../styles.css";
import { DataManager } from "../classes/DataManager";
type Props = {};

declare global {
  interface Window {
    DataTable: typeof DataTable;
    DataManager: typeof DataManager;
  }
}

function Main({}: Props) {
  onMount(() => {
    window.DataTable = DataTable;
    window.DataManager = DataManager;
    DataManager.constructorDataTable();
  });
  return (
    <>
      <div></div>
    </>
  );
}

export default Main;
