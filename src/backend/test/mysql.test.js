const mysql = require("../controllers/mysql");

let insertSql = "insert into tbl_operation_log (" +
    "transaction_hash, " +
    "block_hash," +
    "from_address," +
    "contract_name," +
    "contract_version," +
    "contract_function," +
    "contract_params," +
    "transaction_receipt," +
    "time" +
    ") values ";
let insertData = [
    "0x41db17cd230460768a445c5c2230dd52fdb390d06f91a9c71c5ffe2f8d013463",
    "0x8b66957100897ecdd8590a4b59128d9e6fd6a673275cf82b37334cdce2955c3d",
    "0xc84c01b3f71fe67153d447bb0687842d894befa5",
    "UsersController",
    "v2",
    "delUser",
    "",
    "",
    new Date().getTime()
];
insertSql += mysql.escape([insertData]);
console.log(insertSql);
mysql.query(insertSql, (err, results, fields) => {

});
// mysql.query("select * from tbl_operation_log limit 0,5", (err, results, fields) => {
//     console.log(results[0].block_hash);
// });