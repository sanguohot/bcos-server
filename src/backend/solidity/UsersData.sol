pragma solidity ^0.4.2;
import "ContractBase.sol";
contract UsersData is ContractBase("v1") {
    address owner;
    struct Users{
        bool active;
        address accountAddress;
        string publicKey;
        string idCartNo;
        string detail;
    }

    mapping(address=>Users) usersMap;

    event onAddUser(address from,address to,address accountAddress,string publicKey,string idCartNo,string detail);
    event onSetUserDetail(address from,address to,address accountAddress,string detail);
    event onDelUser(address from,address to,address accountAddress,string publicKey,string idCartNo,string detail);
    event onKill(address from,address to);

    function UsersData() public {
        owner = msg.sender;
    }

    function getUserAll(address userId) public constant returns (bool active,address accountAddress,string publicKey,string idCartNo,string detail) {
        Users memory u = usersMap[userId];
        return (
            u.active,
            u.accountAddress,
            u.publicKey,
            u.idCartNo,
            u.detail
        );
    }

    function getUserBasic(address userId) public constant returns (address accountAddress,string publicKey,string idCartNo) {
        Users memory u = usersMap[userId];
        if (!u.active) {
            return (0, "", "");
        }
        return (
            u.accountAddress,
            u.publicKey,
            u.idCartNo
        );
    }

    function getUserDetail(address userId) public constant returns (string detail) {
        if (!usersMap[userId].active) {
            return ("");
        }
        return (
            usersMap[userId].detail
        );
    }

    function addUser(address accountAddress,string publicKey,string idCartNo
    ,string detail) public returns (address userId){
        if(accountAddress == 0){
            return 0;
        }
        bytes memory publicKeyBytes = bytes(publicKey);
        if(publicKeyBytes.length == 0){
            return 0;
        }
        userId = accountAddress;
        if (usersMap[userId].active){
            return 0;
        }
        usersMap[userId] = Users(true,accountAddress,publicKey,idCartNo,detail);
        onAddUser(
            msg.sender,
            owner,
            accountAddress,
            publicKey,
            idCartNo,
            detail
        );
        return userId;
    }

    function setUserDetail(address userId,string detail) public returns (bool succ){
        if (!usersMap[userId].active) {
            return false;
        }
        usersMap[userId].detail = detail;
        onSetUserDetail(msg.sender,owner,userId,detail);
        return true;
    }

    function delUser(address userId) public returns (bool succ){
        if (!usersMap[userId].active) {
            return false;
        }
        usersMap[userId].active = false;
        onDelUser(
            msg.sender,
            owner,
            usersMap[userId].accountAddress,
            usersMap[userId].publicKey,
            usersMap[userId].idCartNo,
            usersMap[userId].detail
        );
        return true;
    }

    function kill() public{
        if(msg.sender == owner){
            selfdestruct(owner);
            onKill(msg.sender,owner);
        }
    }
}