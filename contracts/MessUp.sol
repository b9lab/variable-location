pragma solidity ^0.4.18;

contract MessUp {
    uint public someNumber;
    uint[] public someArray;

    function MessUp() public {
    }

    function getArrayLength() constant public returns (uint) {
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
        // What happened? `ouch` pointed to the first slot, i.e. `someNumber`. And `someNumber` was
        // interpreted as the array length, which was incremented.
    }

    function pushNumberNotWrong(uint newValue) public {
        uint original = someNumber;

        uint[] pointer = someArray;
        pointer.push(newValue);
        
        // Phew!
        assert(someNumber == original);
    }
}
