const MessUp = artifacts.require("./MessUp.sol");

contract('MessUp', function(accounts) {

    let messUp;

    beforeEach("should deploy a new instance", function() {
        return MessUp.new({ from: accounts[0] })
            .then(instance => messUp = instance);
    });

    it("should start with empty array", function() {
        return messUp.getArrayLength()
            .then(length => assert.strictEqual(length.toString(10), "0"));
    });

    it("should be possible to setNumber", function() {
        return messUp.setNumber(78, { from: accounts[0] })
            .then(txObj => messUp.someNumber())
            .then(someNumber => assert.strictEqual(someNumber.toString(10), "78"));
    });

    it("should be possible to pushNumberWrong and mess up", function() {
        return messUp.setNumber(78, { from: accounts[0] })
            .then(txObj => messUp.pushNumberWrong(33, { from: accounts[0] }))
            .then(txObj => messUp.someNumber())
            .then(someNumber => assert.strictEqual(someNumber.toString(10), "79"))
            .then(() => messUp.getArrayLength())
            .then(length => assert.strictEqual(length.toString(10), "79"))
            .then(() => messUp.someArray(78))
            .then(someNumber => assert.strictEqual(someNumber.toString(10), "33"));
    });

    it("should be possible to pushNumberNotWrong and avoid mess up", function() {
        return messUp.setNumber(78, { from: accounts[0] })
            .then(txObj => messUp.pushNumberNotWrong(33, { from: accounts[0] }))
            .then(txObj => messUp.someNumber())
            .then(someNumber => assert.strictEqual(someNumber.toString(10), "78"))
            .then(() => messUp.getArrayLength())
            .then(length => assert.strictEqual(length.toString(10), "1"))
            .then(() => messUp.someArray(0))
            .then(someNumber => assert.strictEqual(someNumber.toString(10), "33"));
    });

});
