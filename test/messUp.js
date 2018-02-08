const Promise = require("bluebird");
const MessUp = artifacts.require("./MessUp.sol");

if (typeof web3.eth.getAccountsPromise !== "function") {
    Promise.promisifyAll(web3.eth, { suffix: "Promise" });
}

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
            // Uh oh the array jumped to a crazy length.
            .then(txObj => messUp.getArrayLength())
            .then(length => assert.strictEqual(length.toString(10), "79"))
            // Uh oh the number now has the crazy length too.
            .then(() => messUp.someNumber())
            .then(someNumber => assert.strictEqual(someNumber.toString(10), "79"))
            // The pushed number was indeed placed at the last index of the array.
            .then(() => messUp.someArray(78))
            .then(someNumber => assert.strictEqual(someNumber.toString(10), "33"))
            // Let's confirm the number is in `someArray` via direct storage peeking.
            .then(() => messUp.getArrayIndexLocation(1, 78))
            .then(slot => web3.eth.getStorageAtPromise(messUp.address, slot))
            .then(value => assert.strictEqual(web3.toBigNumber(value).toString(10), "33"))
            // Let's confirm the number is "in the array" of `someNumber` via direct storage peeking.
            .then(() => messUp.getArrayIndexLocation(0, 78))
            .then(slot => web3.eth.getStorageAtPromise(messUp.address, slot))
            .then(value => assert.strictEqual(web3.toBigNumber(value).toString(10), "33"));
    });

    it("should be possible to pushNumberNotWrong and avoid mess up", function() {
        return messUp.setNumber(78, { from: accounts[0] })
            .then(txObj => messUp.pushNumberNotWrong(33, { from: accounts[0] }))
            // Correct length.
            .then(txObj => messUp.getArrayLength())
            .then(length => assert.strictEqual(length.toString(10), "1"))
            // Correct number
            .then(() => messUp.someNumber())
            .then(someNumber => assert.strictEqual(someNumber.toString(10), "78"))
            // The pushed number was indeed placed at the last index of the array.
            .then(() => messUp.someArray(0))
            .then(someNumber => assert.strictEqual(someNumber.toString(10), "33"))
            // Let's confirm the number is in `someArray` via direct storage peeking.
            .then(() => messUp.getArrayIndexLocation(1, 0))
            .then(slot => web3.eth.getStorageAtPromise(messUp.address, slot))
            .then(value => assert.strictEqual(web3.toBigNumber(value).toString(10), "33"))
            // Let's confirm there is nothing"in the array" of `someNumber` via direct storage peeking.
            .then(() => messUp.getArrayIndexLocation(0, 0))
            .then(slot => web3.eth.getStorageAtPromise(messUp.address, slot))
            .then(value => assert.strictEqual(web3.toBigNumber(value).toString(10), "0"))
            // Let's confirm there is nothing"in the array" of `someNumber` via direct storage peeking.
            .then(() => messUp.getArrayIndexLocation(0, 77))
            .then(slot => web3.eth.getStorageAtPromise(messUp.address, slot))
            .then(value => assert.strictEqual(web3.toBigNumber(value).toString(10), "0"))
            // Let's confirm there is nothing"in the array" of `someNumber` via direct storage peeking.
            .then(() => messUp.getArrayIndexLocation(0, 78))
            .then(slot => web3.eth.getStorageAtPromise(messUp.address, slot))
            .then(value => assert.strictEqual(web3.toBigNumber(value).toString(10), "0"));
    });

});
