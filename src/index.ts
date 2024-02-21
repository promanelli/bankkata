enum TransactionType {
    Deposit = 'Deposit',
    Withdrawal = 'Withdrawal'
}
class Amount {
    constructor(private value: number) {}

    add(amount: Amount): Amount {
        return new Amount(this.value + amount.value);
    }

    subtract(amount: Amount): Amount {
        return new Amount(this.value - amount.value);
    }

    isNegative(): boolean {
        return this.value < 0;
    }

    toString(): string {
        return this.value.toString();
    }
}

class Transaction {
    constructor(public date: Date, private amount: Amount, public type: TransactionType) {}

    adjustBalance(balance: Amount): Amount {
        return this.type === TransactionType.Deposit ? balance.add(this.amount) : balance.subtract(this.amount);
    }

    toString(balance: Amount): string {
        let credit = this.type === TransactionType.Deposit ? this.amount.toString() : '';
        let debit = this.type === TransactionType.Withdrawal ? this.amount.toString() : '';
        return `${this.date.toLocaleDateString()} || ${credit} || ${debit} || ${balance.toString()}`;
    }
}

class Transactions {
    private transactions: Transaction[] = [];

    add(transaction: Transaction): void {
        this.transactions.unshift(transaction);
    }

    adjustBalance(): Amount {
        let balance = new Amount(0);
        for (let transaction of this.transactions) {
            balance = transaction.adjustBalance(balance);
        }
        return balance;
    }

    print(): string {
        let balance = new Amount(0);
        let output = 'date || credit || debit || balance\n';
        for (let transaction of this.transactions) {
            balance = transaction.adjustBalance(balance);
            output += transaction.toString(balance) + '\n';
        }
        return output;
    }
}

class Account {
    private transactions = new Transactions();

    deposit(amount: Amount): void {
        this.transactions.add(new Transaction(new Date(), amount, TransactionType.Deposit));
    }

    withdraw(amount: Amount): void {
        const balance = this.transactions.adjustBalance();
        if (balance.subtract(amount).isNegative()) {
            throw new Error('Insufficient balance');
        }
        this.transactions.add(new Transaction(new Date(), amount, TransactionType.Withdrawal));
    }

    printStatement(): void {
        console.log('DATE | AMOUNT | BALANCE');
        console.log(this.transactions.print());
    }
}

let account = new Account();
account.deposit(new Amount(1000));
account.deposit(new Amount(2000));
account.withdraw(new Amount(500));
console.log(account.printStatement());