pragma solidity ^0.4.2;
import "ContractBase.sol";
contract FilesData is ContractBase("v1") {
    address owner;
    uint MAX_SIGN_LEN = 3;
    struct Files{
        bool active;
        address ownerAddress;
        address[] signerAddressList;
        string[] signDataList;
        string fileHash;
        string filePath;
        uint originalFileSize;
        string detail;
    }

    mapping(string=>Files) filesMap;

    event onAddFile(address from,address to,string fileId,address ownerAddress,string fileHash,string filePath,string detail);
    event onAddSign(address from,address to,string fileId,address signerAddress,string signData);
    event onSetFileDetail(address from,address to,string fileId,string detail);
    event onDelFile(address from,address to,string fileId,address ownerAddress,string fileHash,string filePath,string detail);
    event onKill(address from,address to);

    function FilesData() public {
        owner = msg.sender;
    }

    function isAccountAddressExist(string fileId, address accountAddress) public constant returns (bool valid){
        Files memory f = filesMap[fileId];
        if (accountAddress == f.ownerAddress){
            return true;
        }
        valid = false;
        for(uint i=0; i<f.signerAddressList.length; i++){
            if(f.signerAddressList[i] == accountAddress){
                valid = true;
                break;
            }
        }
        return valid;
    }

    function getFileAll(string fileId) public constant returns (
        bool active,address ownerAddress,uint signSize,
        string fileHash, string filePath, uint originalFileSize, string detail) {
        Files memory f = filesMap[fileId];
        return (
            f.active,
            f.ownerAddress,
            f.signerAddressList.length,
            f.fileHash,
            f.filePath,
            f.originalFileSize,
            f.detail
        );
    }

    function getFileSignSize(string fileId) public constant returns (uint size) {
        Files memory f = filesMap[fileId];
        if (!f.active) {
            return 0;
        }
        return f.signerAddressList.length;
    }

    function getFileSignerAddressByIndex(string fileId, uint index) public constant returns (address signerAddress) {
        Files memory f = filesMap[fileId];
        if (!f.active) {
            return 0;
        }
        if(index<0 || index>=MAX_SIGN_LEN){
            return 0;
        }
        return f.signerAddressList[index];
    }

    function getFileSignDataByIndex(string fileId, uint index) public constant returns (string signData) {
        Files memory f = filesMap[fileId];
        if (!f.active) {
            return "";
        }
        if(index<0 || index>=MAX_SIGN_LEN){
            return "";
        }
        return f.signDataList[index];
    }

    function getFileBasic(string fileId) public constant returns (address ownerAddress, string fileHash, string filePath, uint signSize, uint originalFileSize) {
        Files memory f = filesMap[fileId];
        if (!f.active) {
            return (0, "", "", 0, 0);
        }
        return (
            f.ownerAddress,
            f.fileHash,
            f.filePath,
            f.signerAddressList.length,
            f.originalFileSize
        );
    }

    function getFileDetail(string fileId) public constant returns (string detail) {
        if (!filesMap[fileId].active) {
            return ("");
        }
        return (
            filesMap[fileId].detail
        );
    }

    function addFileSigner(string fileId, address accountAddress, string signData) public returns (bool succ){
        Files memory f = filesMap[fileId];
        if (!f.active) {
            return false;
        }
        if(isAccountAddressExist(fileId, accountAddress)){
            return false;
        }
        if(f.signerAddressList.length>=MAX_SIGN_LEN || f.signDataList.length>=MAX_SIGN_LEN){
            return false;
        }
        if(f.signDataList.length != f.signerAddressList.length){
            return false;
        }
        filesMap[fileId].signerAddressList[f.signerAddressList.length] = accountAddress;
        filesMap[fileId].signDataList[f.signDataList.length] = signData;
        onAddSign(
            msg.sender,
            owner,
            fileId,
            accountAddress,
            signData
        );
        return true;
    }

    function addFile(address accountAddress, string signData, string fileHash, string filePath, uint originalFileSize, string detail) public returns (string fileId){
        fileId = fileHash;
        if (filesMap[fileId].active){
            return "";
        }
        address[] memory signerAddressList = new address[](1);
        string[] memory signDataList = new string[](1);
        signerAddressList[0] = accountAddress;
        signDataList[0] = signData;
        filesMap[fileId] = Files(
            true,
            accountAddress,
            signerAddressList,
            signDataList,
            fileHash,
            filePath,
            originalFileSize,
            detail
        );

        onAddFile(
            msg.sender,
            owner,
            fileId,
            accountAddress,
            fileHash,
            filePath,
            detail
        );
        onAddSign(
            msg.sender,
            owner,
            fileId,
            accountAddress,
            signData
        );

        return fileId;
    }

    function setFileDetail(string fileId, string detail) public returns (bool succ){
        if (!filesMap[fileId].active) {
            return false;
        }
        filesMap[fileId].detail = detail;
        onSetFileDetail(msg.sender,owner,fileId,detail);
        return true;
    }

    function delFile(string fileId) public returns (bool succ){
        if (!filesMap[fileId].active) {
            return false;
        }
        filesMap[fileId].active = false;
        onDelFile(
            msg.sender,
            owner,
            fileId,
            filesMap[fileId].ownerAddress,
            filesMap[fileId].fileHash,
            filesMap[fileId].filePath,
            filesMap[fileId].detail
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