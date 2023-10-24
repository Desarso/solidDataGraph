import { onMount } from "solid-js";
import { DataTable } from "../classes/DataTable";
import "../styles.css";
type Props = {};

declare global {
  interface Window {
    DataTable: typeof DataTable;
  }
}

function Main({}: Props) {
  onMount(() => {
    window.DataTable = DataTable;
    DataTable.generateUsers(1000);
  });
  return (
    <>
      <div></div>
    </>
  );
}

export default Main;
