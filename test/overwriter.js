const Overwriter = artifacts.require("./Overwriter.sol");

contract('Overwriter', function(accounts) {

    let overwriter;

    beforeEach("should deploy a new instance", function() {
        return Overwriter.new({ from: accounts[0] })
            .then(instance => overwriter = instance);
    });

    it("should start with unset BigFoot", function() {
        return overwriter.someBigFoot()
            .then(someBigFoot => {
                assert.strictEqual(someBigFoot[0].toString(10), "0");
                assert.strictEqual(someBigFoot[1].toString(10), "0");
            });
    });

    it("should be possible to setNumber", function() {
        return overwriter.setNumber(78, 81, { from: accounts[0] })
            .then(txObj => overwriter.someFoot())
            .then(someFoot => assert.strictEqual(someFoot.toString(10), "78"))
            .then(() => overwriter.someToe())
            .then(someToe => assert.strictEqual(someToe.toString(10), "81"));
    });

    it("should be possible to saveBigFootWrong and overwrite", function() {
        return overwriter.setNumber(78, 81, { from: accounts[0] })
            .then(txObj => overwriter.saveBigFootWrong(33, 35, { from: accounts[0] }))
            .then(txObj => overwriter.someFoot())
            .then(someFoot => assert.strictEqual(someFoot.toString(10), "33"))
            .then(() => overwriter.someToe())
            .then(someToe => assert.strictEqual(someToe.toString(10), "35"))
            .then(() => overwriter.someBigFoot())
            .then(someBigFoot => {
                assert.strictEqual(someBigFoot[0].toString(10), "33");
                assert.strictEqual(someBigFoot[1].toString(10), "35");
            });
    });

    it("should be possible to saveBigFootNotWrong and avoid overwriting", function() {
        return overwriter.setNumber(78, 81, { from: accounts[0] })
            .then(txObj => overwriter.saveBigFootNotWrong(33, 35, { from: accounts[0] }))
            .then(txObj => overwriter.someFoot())
            .then(someFoot => assert.strictEqual(someFoot.toString(10), "78"))
            .then(() => overwriter.someToe())
            .then(someToe => assert.strictEqual(someToe.toString(10), "81"))
            .then(() => overwriter.someBigFoot())
            .then(someBigFoot => {
                assert.strictEqual(someBigFoot[0].toString(10), "33");
                assert.strictEqual(someBigFoot[1].toString(10), "35");
            });
    });

});
