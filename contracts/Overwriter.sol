pragma solidity ^0.4.18;

contract Overwriter {
    struct BigFoot {
        uint smallFoot;
    }

    uint public someNumber;
    BigFoot public someBigFoot;

    function Overwriter() public {
    }

    function setNumber(uint newValue) public {
        someNumber = newValue;
    }

    function saveBigFootWrong(uint newSmallFoot) public {
        BigFoot ouch;
        ouch.smallFoot = newSmallFoot;
        someBigFoot = ouch;

        // That hurts, doesn't it?
        assert(someNumber == newSmallFoot);
        // What happened? `ouch` pointed to the first slot, i.e. `someNumber`. And `someNumber` was
        // interpreted as the first field.
    }

    function saveBigFootNotWrong(uint newSmallFoot) public {
        uint original = someNumber;

        someBigFoot.smallFoot = newSmallFoot;
        
        // Phew!
        assert(someNumber == original);
    }
}
