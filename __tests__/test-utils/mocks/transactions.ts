import { faker } from '@faker-js/faker';
import { Transactions } from '../../../src/app/modules/transactions/entity/transactions.entity';
import { TransactionsType } from '../../../src/app/modules/transactions/enum/transactions-type.enum';

export const TransactionMock = (
  override = {} as Partial<Transactions>,
): Transactions => ({
  id: faker.string.uuid(),
  description: faker.person.fullName(),
  amount: faker.number.int(),
  type: faker.helpers.arrayElement(Object.values(TransactionsType)),
  ...override,
});

export const TransactiosnMock = (quantity: number): Transactions[] => {
  const deliverymen = [];
  for (let i = 0; i < quantity; i++) {
    deliverymen.push(TransactionMock());
  }
  return deliverymen;
};
