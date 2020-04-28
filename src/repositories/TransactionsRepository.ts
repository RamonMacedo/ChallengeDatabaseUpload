import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const Tincome = transactions.reduce((total, transaction) => {
      const { value } = transaction;

      return transaction.type === 'income' ? total + Number(value) : total;
    }, 0);

    const Toutcome = transactions.reduce((total, transaction) => {
      const { value } = transaction;

      return transaction.type === 'outcome' ? total + Number(value) : total;
    }, 0);

    const total = Tincome - Toutcome;

    const balance: Balance = {
      income: Tincome,
      outcome: Toutcome,
      total,
    };

    return balance;
  }
}

export default TransactionsRepository;
