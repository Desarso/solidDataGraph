import { DragNDrop } from "../modules/DragNDrop";
import { Helper } from "./Helper";

export class DataTable {
  private static _dragNDropInit: boolean = false;
  static dataFieldsSet: Set<string> = new Set<string>();
  static columnWidths: number[] = [];
  static maps: Map<any, any[]> = new Map<any, any[]>();
  static dataTypeMap: Map<string, string> = new Map<string, string>();
  static index: number = 0;
  static bottomIndex: number = 0;

  static createTableFromGenerated(amount: number): any {
    let users = Helper.generateUsers(amount);
    let table = DataTable.generateDataTable(JSON.stringify(users));
    return table;
  }

  static generateDataTable(
    Data: string,
    className: string = "data-table"
  ): HTMLDivElement {
    let newDataTable = document.createElement("div");
    DataTable.appendToBody(newDataTable);
    newDataTable.classList.add(className);
    DataTable.dataFieldsSet = DataTable.getDataSet(Data);
    DataTable.inferFieldTypes(Data);
    let header = DataTable.generateHeader(DataTable.getDataSet(Data));
    newDataTable.appendChild(header);
    let generateRows = DataTable.generateRows(Data);
    newDataTable.appendChild(generateRows);
    DataTable.maps = DataTable.generateMapFromDataFieldToElements();
    DataTable.adjustColumnWidths();
    return newDataTable;
  }

  static inferFieldTypes(Data: string): Map<string, string> {
    let usersArray = JSON.parse(Data);
    let map = new Map<string, string>();
    for (let user of usersArray) {
      for (let key in user) {
        let value = user[key];
        if (typeof value === "number") {
          map.set(key, "number");
        } else if (typeof value === "string") {
          map.set(key, "string");
        }
      }
    }
    DataTable.dataTypeMap = map;
    return map;
  }

  static generateHeader(dataSet: Set<string>): HTMLDivElement {
    let header = document.createElement("div");
    header.classList.add("header");
    for (let field of dataSet) {
      let fieldHolder = document.createElement("div");
      let fieldDiv = document.createElement("div");
      let border = document.createElement("div");
      let innerWrapper = document.createElement("div");
      let arrow = document.createElement("div");
      arrow.setAttribute("data-field", field);
      arrow.setAttribute("sort-state", "none");
      fieldDiv.classList.add("field");
      innerWrapper.classList.add("inner-wrapper");
      fieldHolder.classList.add("field-holder");
      fieldHolder.setAttribute("data-field", field);
      border.classList.add("border");
      //add datafield type
      border.setAttribute("data-field", field);
      arrow.classList.add("arrow");

      arrow.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
          </svg>
          `;
      DataTable.createBorderListener(border, fieldHolder);
      DataTable.createArrowListener(arrow);
      innerWrapper.innerText = field;
      header.appendChild(fieldHolder);
      fieldHolder.appendChild(fieldDiv);
      fieldDiv.appendChild(innerWrapper);
      fieldDiv.appendChild(arrow);
      fieldDiv.appendChild(border);
    }
    return header;
  }

  static adjustColumnWidths(): void {
    //for each data field, check each column
    //if any field is wider than the column, set the column width to the field width
    for (let field of DataTable.dataFieldsSet) {
      let elements = DataTable.maps.get(field);
      let maxWidth = 0;
      for (let element of elements) {
        if (element.clientWidth > maxWidth) {
          maxWidth = element.clientWidth;
        }
      }
      DataTable.changeColumnWidth(field, maxWidth);
    }
  }

  static generateRows(Data: string): HTMLDivElement {
    let usersArray = JSON.parse(Data);
    let rows = document.createElement("div");
    let widths = DataTable.getColumnWidths();
    rows.classList.add("rows");
    for (let user of usersArray) {
      let row = document.createElement("div");
      row.classList.add("row");
      row.setAttribute("data-index", DataTable.index.toString());
      DataTable.index++;
      let index = 0;
      for (let key in user) {
        let field = document.createElement("div");
        let innerWrapper = document.createElement("div");
        field.classList.add("field");
        field.classList.add(key);
        innerWrapper.classList.add(DataTable.dataTypeMap.get(key) as string);
        field.style.width = widths[index] + "px";
        innerWrapper.innerText = user[key];
        field.appendChild(innerWrapper);
        row.appendChild(field);
        index++;
      }
      rows.appendChild(row);
    }
    return rows;
  }

  //attach to bottom
  static pushRow(Data: string): void {
    let data = JSON.parse(Data);
    let rows = document.querySelector(".rows");
    let widths = DataTable.getColumnWidths();
    let row = document.createElement("div");
    row.classList.add("row");
    row.setAttribute("data-index", DataTable.index.toString());
    DataTable.index++;
    let index = 0;
    for (let key in data) {
      let field = document.createElement("div");
      let innerWrapper = document.createElement("div");
      field.classList.add("field");
      field.classList.add(key);
      innerWrapper.classList.add(DataTable.dataTypeMap.get(key) as string);
      field.style.width = widths[index] + "px";
      innerWrapper.innerText = data[key];
      field.appendChild(innerWrapper);
      row.appendChild(field);
      index++;
    }
    rows?.appendChild(row);
    //add row to map
    for (let key in data) {
      let elements = DataTable.maps.get(key);
      elements?.push(row.querySelector("." + key));
    }
  }

  //attach to top
  static unshiftRow(Data: string): void {
    let data = JSON.parse(Data);
    let rows = document.querySelector(".rows");
    let widths = DataTable.getColumnWidths();
    let row = document.createElement("div");
    row.classList.add("row");
    row.setAttribute("data-index", DataTable.bottomIndex.toString());
    DataTable.bottomIndex--;
    let index = 0;
    for (let key in data) {
      let field = document.createElement("div");
      let innerWrapper = document.createElement("div");
      field.classList.add("field");
      field.classList.add(key);
      innerWrapper.classList.add(DataTable.dataTypeMap.get(key) as string);
      field.style.width = widths[index] + "px";
      innerWrapper.innerText = data[key];
      field.appendChild(innerWrapper);
      row.appendChild(field);
      index++;
    }
    rows?.prepend(row);
    //add row to map
    for (let key in data) {
      let elements = DataTable.maps.get(key);
      elements?.unshift(row.querySelector("." + key));
    }
  }

  //remove from bottom
  static popRow(): void {
    let rows = document.querySelectorAll(".row");
    let lastRow = rows[rows.length - 1];
    lastRow.remove();
  }

  //remove from top
  static shiftRow(): void {
    let rows = document.querySelectorAll(".row");
    let firstRow = rows[0];
    firstRow.remove();
    DataTable.bottomIndex++;
  }

  static changeColumnWidth(field: string, width: number) {
    let elements = DataTable.maps.get(field);
    //also change the width of the header
    let headerElement = document.querySelector("[data-field=" + field + "]");
    headerElement?.setAttribute("style", "width:" + width + "px");

    for (let element of elements!) {
      element.style.width = width + "px";
    }
    DataTable.getColumnWidths();
  }

  static getColumnWidths(): number[] {
    let columns = document.querySelectorAll(".header .field-holder");
    let widths: number[] = [];
    for (let column of columns) {
      widths.push(column.clientWidth);
    }
    DataTable.columnWidths = widths;
    return widths;
  }

  static generateMapFromDataFieldToElements(): Map<any, any[]> {
    let dataFields = DataTable.dataFieldsSet;
    let map = new Map<any, any[]>();
    for (let field of dataFields) {
      let elements = document.querySelectorAll(`.${field}`);
      map.set(field, Array.from(elements));
    }

    return map;
  }

  static appendToBody(element: HTMLElement): void {
    let body = document.querySelector("body");
    body?.appendChild(element);
  }

  static createBorderListener(
    border: HTMLDivElement,
    fieldDiv: HTMLDivElement
  ): void {
    let mousePosition = { x: 0, y: 0 };
    let previousMousePosition = { x: 0, y: 0 };
    let pointerdown = false;
    let previousWidth = 0;
    let previousHolderWidth = 0;

    document.addEventListener("pointermove", (e: PointerEvent) => {
      mousePosition.x = e.clientX;
      mousePosition.y = e.clientY;
      if (pointerdown) {
        DataTable.clearSelection();
        let newWidth =
          previousWidth + mousePosition.x - previousMousePosition.x;
        let field = fieldDiv.querySelector(".field");
        let fieldWidth = field.offsetWidth;
        if (newWidth < fieldWidth - 100) {
          newWidth = fieldWidth;
        }
        let elements = DataTable.maps.get(border.getAttribute("data-field"));
        for (let element of elements) {
          element.style.width = newWidth + "px";
        }
        previousHolderWidth = newWidth;
        fieldDiv.style.width = newWidth + "px";
      }
    });

    border.addEventListener("pointerdown", (e: PointerEvent) => {
      pointerdown = true;
      previousMousePosition.x = e.clientX;
      previousMousePosition.y = e.clientY;
      previousWidth = fieldDiv.clientWidth;
    });

    document.addEventListener("pointerup", () => {
      pointerdown = false;
      let field = fieldDiv.querySelector(".field");
      let fieldWidth = field.offsetWidth;
      if (previousHolderWidth < fieldWidth) {
        fieldDiv.style.width = fieldWidth + "px";
        DataTable.changeColumnWidth(
          fieldDiv.querySelector(".field")?.innerText as string,
          fieldWidth
        );
      }
      DataTable.adjustColumnWidths();
      DataTable.getColumnWidths();
    });
  }

  static createArrowListener(arrow: HTMLDivElement): void {
    let defaultRows = document.querySelectorAll(".row");

    arrow.addEventListener("click", () => {
      //get all other arrows and remove active class
      let arrows = document.querySelectorAll(".arrow");
      for (let arr of arrows) {
        if (arr != arrow) {
          arr.classList.remove("active");
          arr.classList.remove("active-reverse");
          arr.setAttribute("sort-state", "none");
          arr.style.transform = "rotate(0deg)";
        }
      }
      let field = arrow.getAttribute("data-field");
      let state = arrow.getAttribute("sort-state");
      if (field) {
        if (state === "none") {
          arrow.classList.add("active");
          //rotate arrow 180 degrees
          arrow.style.transform = "rotate(180deg)";
          arrow.setAttribute("sort-state", "asc");
          DataTable.sortByField(field, state);
        } else if (state === "asc") {
          arrow.classList.remove("active");
          arrow.classList.add("active-reverse");
          arrow.setAttribute("sort-state", "desc");
          arrow.style.transform = "rotate(0deg)";
          DataTable.sortByField(field, state);
        } else if (state === "desc") {
          arrow.classList.remove("active-reverse");
          arrow.setAttribute("sort-state", "none");

          for (let row of defaultRows) {
            row.remove();
          }
          let rowsDiv = document.querySelector(".rows");
          for (let element of DataTable.maps.get(field) as HTMLElement[]) {
            rowsDiv?.appendChild(element.parentElement as HTMLElement);
          }
        }
      }
    });
  }

  private static clearSelection() {
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
    } else if (document.getSelection) {
      document.getSelection()?.removeAllRanges();
    } else if ((document as any).selection) {
      (document as any).selection.empty();
    }
  }

  static sortByField(field: string, order: string): void {
    let rows = document.querySelectorAll(".row");
    let elements = DataTable.maps.get(field);
    let sortedElements: HTMLElement[] = [];
    if (DataTable.dataTypeMap.get(field) === "number") {
      sortedElements = DataTable.sortNumbers(elements, order);
    } else {
      sortedElements = DataTable.sortStrings(elements, order);
    }
    for (let row of rows) {
      row.remove();
    }
    let rowsDiv = document.querySelector(".rows");
    for (let element of sortedElements) {
      rowsDiv?.appendChild(element.parentElement as HTMLElement);
    }
  }

  static sortNumbers(elements: any[], order: string): HTMLElement[] {
    let sortedElements: HTMLElement[] = [];
    let elementsMap: Map<number, HTMLElement[]> = new Map<
      number,
      HTMLElement[]
    >();
    for (let element of elements) {
      let value = element.innerText;
      if (elementsMap.has(value)) {
        let array = elementsMap.get(value);
        array?.push(element);
        elementsMap.set(value, array as HTMLElement[]);
      } else {
        elementsMap.set(value, [element]);
      }
    }
    let sortedKeys = Array.from(elementsMap.keys()).sort((a, b) => {
      if (order === "asc") {
        return a - b;
      } else {
        return b - a;
      }
    });
    for (let key of sortedKeys) {
      let array = elementsMap.get(key);
      for (let element of array as HTMLElement[]) {
        sortedElements.push(element);
      }
    }
    return sortedElements;
  }

  static sortStrings(elements: any[], order: string): HTMLElement[] {
    let sortedElements: HTMLElement[] = [];
    let elementsMap: Map<string, HTMLElement[]> = new Map<
      string,
      HTMLElement[]
    >();
    for (let element of elements) {
      let value = element.innerText;
      if (elementsMap.has(value)) {
        let array = elementsMap.get(value);
        array?.push(element);
        elementsMap.set(value, array as HTMLElement[]);
      } else {
        elementsMap.set(value, [element]);
      }
    }
    //use quicksort
    // let sortedKeys = Array.from(elementsMap.keys());
    // DataTable.quickSort(
    //   sortedKeys,
    //   0,
    //   sortedKeys.length - 1,
    //   sortedKeys.length
    // );
    let sortedKeys = Array.from(elementsMap.keys()).sort((a, b) => {
      if (order === "asc") {
        return a.localeCompare(b);
      } else {
        return b.localeCompare(a);
      }
    });
    for (let key of sortedKeys) {
      let array = elementsMap.get(key);
      for (let element of array as HTMLElement[]) {
        sortedElements.push(element);
      }
    }
    return sortedElements;
  }

  static getDataSet(users: string): Set<string> {
    let dataSet = new Set<string>();
    let usersArray = JSON.parse(users);
    for (let user of usersArray) {
      for (let key in user) {
        dataSet.add(key);
      }
    }
    return dataSet;
  }

  static doStuff(id: string) {
    let ele = document.createElement("div");
    ele.classList.add("body");
    document.body.appendChild(ele);
    if (!DataTable._dragNDropInit) {
      console.log("init");
      DragNDrop.init();
      DataTable._dragNDropInit = true;
    }
    let draggable = DragNDrop.createDraggable(id, "draggable");
    let droppable = DragNDrop.createDroppable("droppable");
    let droppable2 = DragNDrop.createDroppable("droppable2");

    console.log(draggable);
    let body = document.querySelector(".body");
    body?.appendChild(droppable.ref);
    body?.appendChild(droppable2.ref);
    body?.appendChild(draggable.ref);
  }

  static generateRandomID(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
