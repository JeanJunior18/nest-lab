export enum AccessLevel {
  'SUPER_USER' = 0,
  'STANDARD' = 1,
  'READ_ONLY' = 2,
}

export class User {
  id: string;
  name: string;
  username: string;
  password: string;
  accessLevel: AccessLevel;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
