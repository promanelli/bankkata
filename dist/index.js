"use strict";
var TransactionType;
(function (TransactionType) {
    TransactionType["Deposit"] = "Deposit";
    TransactionType["Withdrawal"] = "Withdrawal";
})(TransactionType || (TransactionType = {}));
var Amount = /** @class */ (function () {
    function Amount(value) {
        this.value = value;
    }
    Amount.prototype.add = function (amount) {
        return new Amount(this.value + amount.value);
    };
    Amount.prototype.subtract = function (amount) {
        return new Amount(this.value - amount.value);
    };
    Amount.prototype.isNegative = function () {
        return this.value < 0;
    };
    Amount.prototype.toString = function () {
        return this.value.toString();
    };
    return Amount;
}());
var Transaction = /** @class */ (function () {
    function Transaction(date, amount, type) {
        this.date = date;
        this.amount = amount;
        this.type = type;
    }
    Transaction.prototype.adjustBalance = function (balance) {
        return this.type === TransactionType.Deposit ? balance.add(this.amount) : balance.subtract(this.amount);
    };
    Transaction.prototype.toString = function (balance) {
        var credit = this.type === TransactionType.Deposit ? this.amount.toString() : '';
        var debit = this.type === TransactionType.Withdrawal ? this.amount.toString() : '';
        return "".concat(this.date.toLocaleDateString(), " || ").concat(credit, " || ").concat(debit, " || ").concat(balance.toString());
    };
    return Transaction;
}());
var Transactions = /** @class */ (function () {
    function Transactions() {
        this.transactions = [];
    }
    Transactions.prototype.add = function (transaction) {
        this.transactions.unshift(transaction);
    };
    Transactions.prototype.adjustBalance = function () {
        var balance = new Amount(0);
        for (var _i = 0, _a = this.transactions; _i < _a.length; _i++) {
            var transaction = _a[_i];
            balance = transaction.adjustBalance(balance);
        }
        return balance;
    };
    Transactions.prototype.print = function () {
        var balance = new Amount(0);
        var output = 'date || credit || debit || balance\n';
        for (var _i = 0, _a = this.transactions; _i < _a.length; _i++) {
            var transaction = _a[_i];
            balance = transaction.adjustBalance(balance);
            output += transaction.toString(balance) + '\n';
        }
        return output;
    };
    return Transactions;
}());
var Account = /** @class */ (function () {
    function Account() {
        this.transactions = new Transactions();
    }
    Account.prototype.deposit = function (amount) {
        this.transactions.add(new Transaction(new Date(), amount, TransactionType.Deposit));
    };
    Account.prototype.withdraw = function (amount) {
        var balance = this.transactions.adjustBalance();
        if (balance.subtract(amount).isNegative()) {
            throw new Error('Insufficient balance');
        }
        this.transactions.add(new Transaction(new Date(), amount, TransactionType.Withdrawal));
    };
    Account.prototype.printStatement = function () {
        console.log('DATE | AMOUNT | BALANCE');
        console.log(this.transactions.print());
    };
    return Account;
}());
var account = new Account();
account.deposit(new Amount(1000));
account.deposit(new Amount(2000));
account.withdraw(new Amount(500));
console.log(account.printStatement());
