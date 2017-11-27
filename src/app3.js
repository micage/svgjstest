import * as db from "./DataBase/Table";
import TableView from "./Test/TableView";

var testData = {
    header: ["id", "name", "tree type (german)", "val 1", "val 2"],
    rows: [
        [0, "Heinz", "Birke", 0.12, 13],
        [1, "Gabi", "Eiche", 0.22, 23],
        [2, "Bernd", "Kiefer", 0.32, 33],
        [3, "Lara", "Erle", 0.42, 43],
    ]
};

const url1 = "http://micage.mmm/mmm/svgjs_test/www/api/get_table.php";


db.loadTable(url1).then(
    tableData => {
        document.body.appendChild(TableView({
            data: tableData
        }))
    }, 
    error => console.log(error)
);


