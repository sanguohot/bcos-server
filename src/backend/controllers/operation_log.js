let mysql = require("./mysql");

function saveLogToDb(
    transactionHash,
    blockHash,
    fromAddress,
    toAddress,
    transactionSignData,
    transactionData,
    transactionReceipt,
    transactionDesc,
    cb) {
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
        transactionHash,
        blockHash,
        fromAddress,
        toAddress,
        transactionSignData,
        transactionData,
        transactionReceipt,
        transactionDesc,
        new Date().getTime()
    ];
    insertSql += mysql.escape([insertData]);
    mysql.query(insertSql, cb);
}

exports.saveLogToDb = saveLogToDb;