pragma solidity 0.4.24;

contract Overwriter {
    struct BigFoot {
        // Wherever the struct goes, this goes into the first slot.
        uint smallFoot;
        // and this into the second slot.
        uint smallToe;
    }

    // This is the first declared storage element, it goes into slot 0.
    uint public someFoot;
    // This is the second declared storage element, it goes into slot 1.
    uint public someToe;
    // This is the third declared storage element, it goes into slots 2 and 3.
    BigFoot public someBigFoot;

    constructor() public {
    }

    // Here we overwrite slot 0 correctly.
    function setNumber(uint newFoot, uint newToe) public {
        someFoot = newFoot;
        someToe = newToe;
    }

    function saveBigFootWrong(uint newSmallFoot, uint newSmallToe) public {
        // This struct is pointing to storage by default. Solidity by default points it to slot 0.
        // So slot 0 will contain ouch's smallFoot and slot 1 smallToe. That's also someFoot's slot.
        BigFoot storage ouch;
        // Overwriting slot 0.
        ouch.smallFoot = newSmallFoot;
        // Overwriting slot 1.
        ouch.smallToe = newSmallToe;
        // Now we copy into our properly declared struct.
        someBigFoot = ouch;

        // That hurts, doesn't it?
        assert(someFoot == newSmallFoot);
        assert(someToe == newSmallToe);
        // What happened? `ouch.smallFoot` pointed to the first slot, i.e. `someFoot`. And `someFoot` was
        // interpreted as the first field.
    }

    function saveBigFootNotWrong(uint newSmallFoot, uint newSmallToe) public {
        uint original = someFoot;

        // Here we do not use any intermediary.
        someBigFoot.smallFoot = newSmallFoot;
        someBigFoot.smallToe = newSmallToe;
        
        // Phew!
        assert(someFoot == original);
    }
}
