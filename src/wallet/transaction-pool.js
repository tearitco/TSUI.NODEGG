const Transaction = require("./transaction");
class TransactionPool {
    constructor(){
        this.transactions = [];
    }
    updateOrAddTransaction(transaction){
        let transactionsWithId = this.transactions.find(t => t.id === transaction.id);
        if (transactionsWithId) {
            this.transactions[this.transactions.indexOf(transactionsWithId)] = transaction;
        } else {
            this.transactions.push(transaction);
        }
    }
    existingTransaction(address){
        return this.transactions.find( t => t.input.address === address );
    }
    validTransactions(){
        return this.transactions.filter(transaction => {
            const outputTotal = transaction.outputs.reduce((total, output) => {
                return total + output.amount;
            }, 0);

            if (transaction.input.amount !== outputTotal){
                console.log(`Invalid Transaction from ${transaction.input.address}.`);
                return;
            }

            if (!Transaction.verifyTransaction(transaction)){
                console.log(`Invalid signature from ${transaction.input.address}.`);
                return;
            }
            return transaction;
        });
    }

    clear (){
        this.transactions = [];
    }
}

module.exports = TransactionPool;