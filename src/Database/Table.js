import * as __ from "../Util/ParamCheck";

/** Load a table from a mysql database
    @param {string} - the url of the php script that connects to mysql
    @param {string} - database name
    @param {string} - table name
    @return {Promise}
    success: the resolve function gets the JSON-parsed response (object):    
        resolve({
            columns: [], // an array of strings, the column titles
            rows: [] // an array of data matching the above column layout
        });
    failure: the reject function is called with an error description
        reject ({
            error: "error description"
        })
 */
const loadTable = (args) => {
    if (__DEBUG__) {
        let error = [];
        if (!__.checkObject(args)) {
            error.push("No arguments provided.");
        }
        else {
            if (!__.checkString(args.url)) {
                error.push("No URL string provided.");
            }
            if (!__.checkString(args.db)) {
                error.push("No database name provided.");
            }
            if (!__.checkString(args.table)) {
                error.push("No table name provided.");
            }
        }
        if (error.length) {
            // return an immediately rejected promise
            return new Promise((ok, reject) => { reject({ error: error.join(", ")}); });
        }
    }

    const executor = function (resolve, reject) {

        var xhr = new XMLHttpRequest();
        var req = `${args.url}/${args.db}/${args.table}`;
        xhr.open("GET", req, true); // true means async

        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                let ret = {};
                if (xhr.status === 200) {
                    try {
                        ret = JSON.parse(xhr.responseText);
                    } catch (e) {
                        ret.error = e.message
                        ret.response = xhr.responseText;
                    }
                    if (ret.error) {
                        reject(ret);
                    }
                    else {
                        resolve(ret);
                    }
                }
                else {
                    ret.error = "There was a network error.";
                    reject(ret);
                }
            }
        };
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send();
    };

    return new Promise(executor);
}

/*
     CREATE TABLE `Circle` (
     `id` int(32) UNSIGNED NOT NULL,
     `group_id` int(12) UNSIGNED DEFAULT NULL,
     `d` text NOT NULL,
     `style` varchar(1024) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 */
const createTable = (name) => {
    
}

const getInfo = (url) => {
    var xhr = new XMLHttpRequest();
    var req = `http://mmm-api.mmm/api/info.php`;
    xhr.open("GET", req, true); // true means async

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {

            }
        }
    }
}

export { loadTable }