const Overwriter = artifacts.require("./Overwriter.sol");

contract('Overwriter', function(accounts) {

    let overwriter;

    beforeEach("should deploy a new instance", function() {
        return Overwriter.new({ from: accounts[0] })
            .then(instance => overwriter = instance);
    });

    it("should start with unset BigFoot", function() {
        return overwriter.someBigFoot()
            .then(smallFoot => assert.strictEqual(smallFoot.toString(10), "0"));
    });

    it("should be possible to setNumber", function() {
        return overwriter.setNumber(78, { from: accounts[0] })
            .then(txObj => overwriter.someNumber())
            .then(someNumber => assert.strictEqual(someNumber.toString(10), "78"));
    });

    it("should be possible to saveBigFootWrong and overwrite", function() {
        return overwriter.setNumber(78, { from: accounts[0] })
            .then(txObj => overwriter.saveBigFootWrong(33, { from: accounts[0] }))
            .then(txObj => overwriter.someNumber())
            .then(someNumber => assert.strictEqual(someNumber.toString(10), "33"))
            .then(() => overwriter.someBigFoot())
            .then(someNumber => assert.strictEqual(someNumber.toString(10), "33"));
    });

    it("should be possible to saveBigFootNotWrong and avoid overwriting", function() {
        return overwriter.setNumber(78, { from: accounts[0] })
            .then(txObj => overwriter.saveBigFootNotWrong(33, { from: accounts[0] }))
            .then(txObj => overwriter.someNumber())
            .then(someNumber => assert.strictEqual(someNumber.toString(10), "78"))
            .then(() => overwriter.someBigFoot())
            .then(someNumber => assert.strictEqual(someNumber.toString(10), "33"));
    });

});
