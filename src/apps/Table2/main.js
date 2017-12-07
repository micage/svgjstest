import * as db from "../../DataBase/Table";
import TableView from "../../DOM/TableView/TableView";
import { mount } from "../../DOM/Elements";
/**
 * first we need a database model:
 * it has to manage tables (create, modify, delete)
 * tables have to manage rows and columns
 * a class corresponds to a table
 * the public properties of the class corresponds to table columns
 * instances of the class corresponds to instances of the class
 */

var testData = {
    columns: ["id", "name", "tree type (german)", "val 1", "val 2"],
    rows: [
        [0, "Heinz", "Birke", 0.12, 13],
        [1, "Gabi", "Eiche", 0.22, 23],
        [2, "Bernd", "Kiefer", 0.32, 33],
        [3, "Lara", "Buche", 0.42, 43],
    ]
};

const url1 = "http://mmm-api.mmm/api";


db.loadTable({
    url: url1,
    db: "SVG", 
    table: "Path"
}).then(
    tableData => {
        let tv = TableView({
            data: tableData
        });
        document.body.appendChild(tv);
        mount(tv);
    }, 
    error => {
        console.log(error);
        document.body.appendChild(TableView({
            data: testData
        }));
    }
);


// =================================================================
// Hot Module Replacement (HMR)
if (module.hot) {
    module.hot.accept();

    // dispose handler
    module.hot.dispose(function () {
        // revoke the side effect
        let root = document.getElementsByTagName("div")[0];
        root.remove();
    });
}
