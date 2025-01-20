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
const PAGE_SIZE = 100;

export class DataManager {
  static dataBuffer: any[] = [];
  static mockServer: any[] = Helper.generateUsers(1000);

  static constructorDataTable() {
    let data = DataManager.fetchMock({
      forwards: true,
      start: 0,
      sorting: "id",
    });
    this.dataBuffer.push(...data);
    let dataTable = DataTable.generateDataTable(JSON.stringify(data));
    DataManager.createScrollListeners(dataTable);
  }

  static createScrollListeners(dataTable: HTMLDivElement) {
    //I want to know exactly what position I am in when scrolling
    dataTable.addEventListener("scroll", (e) => {
      let middleRow = DataManager.getMiddleRow(dataTable);
      DataManager.adjustRowsAmounts(dataTable, middleRow);
    });
  }

  static adjustRowsAmounts(dataTable: HTMLDivElement, middleRow: number) {
    let rows = Array.from(dataTable.querySelectorAll(".row"));
    let lowestRow = Math.max(middleRow - 30, 0);
    let highestRow = Math.min(middleRow + 30, this.dataBuffer.length);


    let lowestRowInDOM = parseInt(rows[0].getAttribute("data-index")!);
    let highestRowInDOM = parseInt(rows[rows.length - 1].getAttribute("data-index")!);


    console.log("highestRowInDOM: ", highestRowInDOM)
    console.log("highestRow: ", highestRow)
    // console.log(this.dataBuffer)

    if (lowestRow === lowestRowInDOM && highestRow === highestRowInDOM) return;

    if (lowestRow < lowestRowInDOM) {
      console.log("lowestRow < lowestRowInDOM");
      for (let i = lowestRowInDOM-1; i >= lowestRow; i--) {
        try{
          let row = DataManager.dataBuffer[i];
          row = JSON.stringify(row);
          DataTable.unshiftRow(row);
        }catch{
          console.error("error 1: i=",i," lowestRowInDom: ", lowestRowInDOM, " lowestRow:", lowestRow)
        }
       
      }
    }
    if (lowestRow > lowestRowInDOM) {
     
        for (let i = lowestRowInDOM; i < lowestRow; i++) {
          try{
          console.log("shifting")
          DataTable.shiftRow();
        }catch{
          console.error("error 2: i=",i," lowestRowInDom: ", lowestRowInDOM, " lowestRow:", lowestRow)
        }
        }
     
      //remove rows from the top
     
    }

    if (highestRow > highestRowInDOM && highestRow >= 0) {
      // console.log("highestRow > highestRowInDOM");

      
      //add rows to the bottom
      for (let i = highestRowInDOM + 1; i <= highestRow; i++) {
        let row;

        if (!DataManager.dataBuffer[i]) {
          console.log("here fetching data", DataManager.dataBuffer.length);
          let newData = DataManager.fetchMock({
            forwards: true,
            start: i,
            sorting: "",
            amount: 40,
          });
          DataManager.dataBuffer.push(...newData);
        }
       
        if(!DataManager.dataBuffer[i]){
          continue
        }

        try {
          row = DataManager.dataBuffer[i];
          row = JSON.stringify(row);
          // console.log("push")
          DataTable.pushRow(row);
        } catch (e) {
          console.error("error 3: i=",i," highestRowInDOM: ", highestRowInDOM, " highestRow:", highestRow)
        }
      }
    }
    if (highestRow < highestRowInDOM) {
      //remove rows from the bottom
      for (let i = highestRowInDOM; i > highestRow; i--) {
        try{
          if (highestRow < highestRowInDOM) {
            console.log("popping", i)
            DataTable.popRow();
          }

        }catch{
          console.error("error 4: i=",i," highestRowInDOM: ", highestRowInDOM, " highestRow:", highestRow)
        }
       
      }
    }
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

  static fetchMock({
    forwards = true,
    start = 0,
    sorting = "",
    amount = PAGE_SIZE,
  }: {
    forwards?: boolean;
    start?: number;
    sorting?: string;
    amount?: number;
  }) {
    //I return 100 rows from the mock server
    if (forwards) {
      //we fetch the next amount after sorting entire server by the sorting string
      let rows = this.mockServer;
      //sort by the current index
      if (sorting) {
        rows.sort((a, b) => {
          if (a[sorting] < b[sorting]) return -1;
          if (a[sorting] > b[sorting]) return 1;
          return 0;
        });
      }
      return rows.slice(start, start + amount);
    } else {
      //we fetch the previous amount after sorting entire server by the sorting string
      let rows = this.mockServer;
      //sort by the current index
      if (sorting) {
        rows.sort((a, b) => {
          if (a[sorting] < b[sorting]) return -1;
          if (a[sorting] > b[sorting]) return 1;
          return 0;
        });
      }
      return rows.slice(Math.max(0, start - amount), start);
    }
  }
}
