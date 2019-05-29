pragma solidity 0.4.24;

contract MessUp {
    // This is the first declared storage element, it goes into slot 0.
    uint public someNumber;
    // This is the second declared storage element, it goes into slot 1 and contains the length of the array.
    // But since this is a dynamic size array, the elements will be elsewhere, at sha3(1)...
    uint[] public someArray;

    constructor() public {
    }

    // This function in effect reads from slot 1.
    function getArrayLength() view public returns (uint) {
        return someArray.length;
    }

    // Here we overwrite slot 0 correctly.
    function setNumber(uint newValue) public {
        someNumber = newValue;
    }

    function pushNumberWrong(uint newValue) public {
        // Let's read from slot 0 to be able to do the assert below.
        uint original = someNumber;

        // This array is pointing to storage. Solidity by default points it to slot 0.
        // So slot 0 will contain ouch's length. That's also someNumber's slot.
        uint[] storage ouch;
        // Push increases the length by 1. The length is stored in slot 0.
        ouch.push(newValue);
        // Now we copy into our properly declared array, just to show that this is part of a "regular"
        // sequence of actions.
        someArray = ouch;

        // That hurts, doesn't it?
        assert(someNumber == original + 1);
        // What happened? `ouch` was surreptitiously compiled with the `storage` keyword. But because no
        // storage location was given alongside the declaration, the structure was peremptorily assigned to the
        // first storage slot, i.e. `someNumber`. Since an array keeps its length on the storage slot it is
        // assigned `someNumber` is interpreted as the array length, which was incremented.
    }

    // Here we update the array not wrongly.
    function pushNumberNotWrong(uint newValue) public {
        uint original = someNumber;

        // It is pointing to storage, but because it is assigned here, it is already pointing correctly
        // to slot 1.
        uint[] storage pointer = someArray;
        // So in effect we update someArray.
        pointer.push(newValue);
        
        // Phew!
        assert(someNumber == original);
    }

    // Expensive way to be safe.
    function setNumberInArrayNotWrongMemory(uint newValue) public {
        uint original = someNumber;

        // We are not overwriting anything in storage anyway. We cannot have truly dynamic arrays in memory.
        // So we set the initial size.
        uint[] memory inMem = new uint[](1);
        inMem[0] = newValue;
        someArray = inMem;
        
        // Phew!
        assert(someNumber == original);
    }

    // The remote location of the actual values of the dynamic array in storage. You can use this to confirm
    // with web3.eth.getStorageAt().
    function getArrayIndexLocation(uint storageSlot, uint index) pure public returns (uint slot) {
        return uint(keccak256(abi.encodePacked(storageSlot))) + index;
    }
}
