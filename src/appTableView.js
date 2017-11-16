import TableView from "./DOM/TableView/TableView";
import * as DOM from "./DOM/Elements";
import * as Db from "./DataBase/Table";

//let table = TableView({ data: {} });
//document.body.appendChild(table);
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");
    
});

let args = {
    // 'http://' prefix is important
    url: "http://mmm-api.mmm/api", // does not work anymore, configure routes first!
    // url: "http://mmm-api.mmm/php/",
    // db: "SVG", table: "Path",
    db: "bv2", table: "glomma_apartments",
    // db: "bv2", table: "skallum_apartments",
    // db: "relay", table: "people",
};

Db.loadTable(args).then(
    tableData => {
        let tableView = TableView({
            data: tableData
        });
        document.body.appendChild(tableView);
        DOM.mount(tableView);
    },
    ret => {
        console.warn(ret.error);
        document.write(ret.response);
    }
);



