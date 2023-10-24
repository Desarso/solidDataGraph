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
  static currentContextWindow: number = 0;
  static contextWindowTop: number = 0;
  static contextWindowBottom: number = 99;
  static middleRow: number = 49;

  static mockServer: any[] = Helper.generateUsers(100000);
  static currentRow: number = 0;

  static adjuster: number = 0;

  static constructorDataTable() {
    let data = DataManager.fetchMock(1);
    let dataTable = DataTable.generateDataTable(JSON.stringify(data));
    DataManager.fetchContextWindows(0);
    DataManager.middleRow = 49;
    DataManager.createScrollListeners(dataTable);
  }

  static createScrollListeners(dataTable: HTMLDivElement) {
    let previousRowNumber = 0;
    console.log(dataTable);
    dataTable.addEventListener("scroll", (e) => {
      //figure out what row is at the top of the div
      let rowHeight = dataTable.querySelector(".row")?.clientHeight;
      let rowNumber = Math.floor(dataTable.scrollTop / rowHeight!);

      //going down
      if (rowNumber > previousRowNumber && rowNumber > 50) {
        console.log("going down");
        DataManager.contextWindowTop = rowNumber - 50 + DataManager.adjuster;
        DataManager.middleRow = rowNumber + DataManager.adjuster;
        DataManager.contextWindowBottom = rowNumber + 49 + DataManager.adjuster;
        console.log("top", DataManager.contextWindowTop);
        console.log("middle", DataManager.middleRow);
        console.log("bottom", DataManager.contextWindowBottom);
        // DataManager.adjuster++;
        // DataTable.shiftRow();
        //remove the first context window

        //going up
      } else if (rowNumber < previousRowNumber && rowNumber > 50) {
        console.log("going up");
        DataManager.contextWindowTop = rowNumber - 50 + DataManager.adjuster;
        DataManager.middleRow = rowNumber + DataManager.adjuster;
        DataManager.contextWindowBottom = rowNumber + 49 + DataManager.adjuster;
        // DataManager.currentContextWindow = DataManager.middleRow / 100;
        console.log("top", DataManager.contextWindowTop);
        console.log("middle", DataManager.middleRow);
        console.log("bottom", DataManager.contextWindowBottom);
        // DataManager.adjuster--;
        // let currentContextWindow =
        //   DataManager.contextWindows[DataManager.currentContextWindow];
        //remove the last context window
      }

      previousRowNumber = rowNumber;
    });
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
