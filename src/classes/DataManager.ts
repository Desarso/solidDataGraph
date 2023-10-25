//class must be able to manage data from the API
//it should manage a data window for the dataTable

import { DataTable } from "./DataTable";
import { Helper } from "./Helper";

//the database will manage context windows of 100 rows in size
//it will manage 3 of them. It should real time remove and add rows, to keep the user in the middle of the context window
//when the user makes it out of the first context window, it will fetch the next pagination of data
//and set that context window to be the correct one
//after fetching I rearrange the context windows
//and then keep doing the dynamic adding and removing of divs, to keep the amout of divs in the DOM to less than 100 hundred which is the size of
//one context window
//this should also work for manually load data that does not connect to a database

export class DataManager {
  static contextWindows: any[] = [];
  static mockServer: any[] = Helper.generateUsers(1000);

  static constructorDataTable() {
    let data = DataManager.fetchMock(1);
    let dataTable = DataTable.generateDataTable(JSON.stringify(data));
    DataManager.fetchContextWindows(0);
    DataManager.createScrollListeners(dataTable);
  }

  static createScrollListeners(dataTable: HTMLDivElement) {
    //I want to know exactly what position I am in when scrolling
    dataTable.addEventListener("scroll", (e) => {
      let middleRow = DataManager.getMiddleRow(dataTable);
      let rows = Array.from(dataTable.querySelectorAll(".row"));
      let lowestRow = middleRow - 50;
      let highestRow = middleRow + 50;
      let lowestRowInDOM = parseInt(rows[0].getAttribute("data-index")!);
      let highestRowInDOM = parseInt(
        rows[rows.length - 1].getAttribute("data-index")!
      );
      console.log("lowest row", lowestRow);
      console.log("highest row", highestRow);
      console.log("lowest row in DOM", lowestRowInDOM);
      console.log("highest row in DOM", highestRowInDOM);
      //I need to make sure to always have a buffer of 50 rows in either direction;

      if (middleRow > 50) {
        DataManager.adjustRowsAmounts(dataTable, middleRow);
      } else {
        //make sure to load all low rows to index 0;
        DataManager.attachAllBottomRows(dataTable);
      }
    });
  }

  static attachAllBottomRows(dataTable: HTMLDivElement) {
    let rows = Array.from(dataTable.querySelectorAll(".row"));
    let lowestRow = parseInt(rows[0].getAttribute("data-index")!);
    console.log("lowest row", lowestRow);
    if (lowestRow === 0) return;
    for (let i = lowestRow - 1; i >= 0; i--) {
      let x = Math.floor(i / 100);
      let y = i % 100;
      let row = DataManager.contextWindows[x][y];
      row = JSON.stringify(row);
      DataTable.unshiftRow(row);
    }
  }

  static adjustRowsAmounts(dataTable: HTMLDivElement, middleRow: number) {
    let rows = Array.from(dataTable.querySelectorAll(".row"));
    let lowestRow = middleRow - 50;
    let highestRow = middleRow + 50;
    let lowestRowInDOM = parseInt(rows[0].getAttribute("data-index")!);
    let highestRowInDOM = parseInt(
      rows[rows.length - 1].getAttribute("data-index")!
    );
    console.log("lowest row", lowestRow);
    console.log("highest row", highestRow);
    console.log("lowest row in DOM", lowestRowInDOM);
    console.log("highest row in DOM", highestRowInDOM);

    if (lowestRow === lowestRowInDOM && highestRow === highestRowInDOM) return;

    // if (lowestRow < lowestRowInDOM) {
    //   //add rows to the top
    //   for (let i = lowestRowInDOM - 1; i >= lowestRow; i--) {
    //     let x = Math.floor(i / 100);
    //     let y = i % 100;
    //     let row = DataManager.contextWindows[x][y];
    //     console.log(i);
    //     row = JSON.stringify(row);
    //     DataTable.unshiftRow(row);
    //   }
    // }
    // if (lowestRow > lowestRowInDOM) {
    //   //remove rows from the top
    //   for (let i = lowestRowInDOM; i < lowestRow; i++) {
    //     DataTable.shiftRow();
    //   }
    // }

    // if (highestRow > highestRowInDOM) {
    //   //add rows to the bottom
    //   for (let i = highestRowInDOM + 1; i <= highestRow; i++) {
    //     let x = Math.floor(i / 100);
    //     let y = i % 100;
    //     let row;
    //     //try catch is for when the highest row is not in the context window

    //     try {
    //       row = DataManager.contextWindows[x][y];
    //       row = JSON.stringify(row);
    //       DataTable.pushRow(row);
    //       console.log("here");
    //     } catch (e) {
    //       console.log(e);
    //       console.log(x, y);
    //       break;
    //     }
    //   }
    // }
    // if (highestRow < highestRowInDOM) {
    //   //remove rows from the bottom
    //   for (let i = highestRowInDOM; i > highestRow; i--) {
    //     DataTable.popRow();
    //   }
    // }
  }

  static getTopRow(dataTable: HTMLDivElement) {
    let firstRow = dataTable.querySelector(".row")?.getAttribute("data-index");
    let rowsFromTop = DataManager.rowAmountFromTop(dataTable);
    let topRow = parseInt(firstRow!) + rowsFromTop;
    return topRow;
  }

  static getMiddleRow(dataTable: HTMLDivElement) {
    let dataTableHeight = dataTable.clientHeight;
    let rowHeight = dataTable.querySelector(".row")?.clientHeight;
    let middleRow = Math.floor(dataTableHeight / 2 / rowHeight!);
    return DataManager.getTopRow(dataTable) + middleRow;
  }

  static rowAmountFromTop(dataTable: HTMLDivElement) {
    let rowHeight = dataTable.querySelector(".row")?.clientHeight;
    let rowNumber = Math.floor(dataTable.scrollTop / rowHeight!);
    return rowNumber;
  }

  static fetchContextWindows(index: number) {
    //fetch the first 3 context windows
    let contextWindows = [];
    for (let i = 1; i <= 3; i++) {
      contextWindows.push(DataManager.fetchMock(index + i));
    }
    DataManager.contextWindows = contextWindows;
  }

  static fetchMock(page: number, amount: number = 100) {
    //I return 100 rows from the mock server
    console.log((page - 1) * amount, (page - 1) * amount + amount);
    let rows = DataManager.mockServer.slice(
      (page - 1) * amount,
      (page - 1) * amount + amount
    );
    return rows;
  }
}
