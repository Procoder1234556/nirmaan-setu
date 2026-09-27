import type { User } from '../entities';

export type AuthUser = User & {
  identities?: Record<string, any>;
};
