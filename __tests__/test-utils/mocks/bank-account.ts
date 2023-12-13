import { faker } from '@faker-js/faker';
import { BankAccount } from '../../../src/app/modules/bank-account/entity/bank-account.entity';
import { BankAccountType } from '../../../src/app/modules/bank-account/enum/bank-account-type.enum';

export const BankAccountMock = (
  override = {} as Partial<BankAccount>,
): BankAccount => ({
  id: faker.string.uuid(),
  accountNumber: faker.person.fullName(),
  agencyNumber: faker.internet.email(),
  balance: faker.number.int(),
  isActive: faker.datatype.boolean(),
  type: faker.helpers.arrayElement(Object.values(BankAccountType)),
  ...override,
});

export const BankAccountsMock = (quantity: number): BankAccount[] => {
  const deliverymen = [];
  for (let i = 0; i < quantity; i++) {
    deliverymen.push(BankAccountMock());
  }
  return deliverymen;
};
