import { faker } from '@faker-js/faker';
import { User } from '../../../src/app/modules/user/entity/user.entity';

export const UserMock = (override = {} as Partial<User>): User => ({
  id: faker.string.uuid(),
  username: faker.person.fullName(),
  password: faker.internet.email(),
  email: faker.person.fullName(),
  ...override,
});

export const UsersMock = (quantity: number): User[] => {
  const deliverymen = [];
  for (let i = 0; i < quantity; i++) {
    deliverymen.push(UserMock());
  }

  return deliverymen;
};
