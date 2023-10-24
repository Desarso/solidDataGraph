import { DragNDrop } from "../modules/DragNDrop";
import { Helper } from "./Helper";

export class DataTable {
  private static _dragNDropInit: boolean = false;
  static dataFieldsSet: Set<string> = new Set<string>();
  static columnWidths: number[] = [];
  static maps: Map<any, any[]> = new Map<any, any[]>();
  static dataTypeMap: Map<string, string> = new Map<string, string>();

  static generateUsers(amount: number): string {
    let users = Helper.generateUsers(amount);
    DataTable.generateDataTable(users);
    return users;
  }

  static generateDataTable(Data: string): void {
    DataTable.dataFieldsSet = DataTable.getDataSet(Data);
    DataTable.inferFieldTypes(Data);
    console.log(DataTable.dataTypeMap);
    let header = DataTable.generateHeader(DataTable.getDataSet(Data));
    DataTable.appendToBody(header);
    let generateRows = DataTable.generateRows(Data);
    console.log(header);
    DataTable.appendToBody(generateRows);
    DataTable.adjustColumnWidths();

    DataTable.maps = DataTable.generateMapFromDataFieldToElements();
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
      fieldDiv.classList.add("field");
      innerWrapper.classList.add("inner-wrapper");
      fieldHolder.classList.add("field-holder");
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

  static adjustColumnWidths(): void {}

  static generateRows(Data: string): HTMLDivElement {
    let usersArray = JSON.parse(Data);
    let rows = document.createElement("div");
    let widths = DataTable.getColumnWidths();
    rows.classList.add("rows");
    for (let user of usersArray) {
      let row = document.createElement("div");
      row.classList.add("row");
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

  static changeColumnWidth(field: string, width: number) {
    let elements = DataTable.maps.get(field);
    for (let element of elements) {
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
      console.log("previousWidth", previousWidth);
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
      DataTable.getColumnWidths();
    });
  }

  static createArrowListener(arrow: HTMLDivElement): void {
    let states = ["asc", "desc", "none"];
    let state = "none";
    let defaultRows = document.querySelectorAll(".row");

    arrow.addEventListener("click", () => {
      //get all other arrows and remove active class
      let arrows = document.querySelectorAll(".arrow");
      for (let arrow of arrows) {
        arrow.classList.remove("active");
        arrow.classList.remove("active-reverse");
        arrow.style.transform = "rotate(0deg)";
      }
      let field = arrow.getAttribute("data-field");
      if (field) {
        if (state === "none") {
          arrow.classList.add("active");
          //rotate arrow 180 degrees
          arrow.style.transform = "rotate(180deg)";
          state = "asc";
          DataTable.sortByField(field, state);
        } else if (state === "asc") {
          arrow.classList.remove("active");
          arrow.classList.add("active-reverse");
          state = "desc";
          arrow.style.transform = "rotate(0deg)";
          DataTable.sortByField(field, state);
        } else if (state === "desc") {
          arrow.classList.remove("active-reverse");
          state = "none";

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
