pragma solidity ^0.4.18;

contract MessUp {
    uint public someNumber;
    uint[] public someArray;

    function MessUp() public {
    }

    function getArrayLength() view public returns (uint) {
        return someArray.length;
    }

    function setNumber(uint newValue) public {
        someNumber = newValue;
    }

    function pushNumberWrong(uint newValue) public {
        uint original = someNumber;

        uint[] ouch;
        ouch.push(newValue);
        someArray = ouch;

        // That hurts, doesn't it?
        assert(someNumber == original + 1);
        // What happened? `ouch` was surreptitiously compiled with the `storage` keyword. But because no
        // storage location was given alongside the declaration, the structure was peremptorily assigned to the
        // first storage slot, i.e. `someNumber`. Since an array keeps its length on the storage slot it is
        // assigned `someNumber` is interpreted as the array length, which was incremented.
    }

    function pushNumberNotWrong(uint newValue) public {
        uint original = someNumber;

        uint[] pointer = someArray;
        pointer.push(newValue);
        
        // Phew!
        assert(someNumber == original);
    }

    function getArrayIndexLocation(uint storageSlot, uint index) pure returns (uint slot) {
        return uint(keccak256(storageSlot)) + index;
    }
}
