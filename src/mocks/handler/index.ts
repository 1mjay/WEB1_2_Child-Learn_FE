import { signUpHandlers } from './signUpHandlers';
import { postHandlers } from './postHandlers';
import { userHandlers } from './userHandlers';
import { loginHandlers } from './loginHandlers';
import { intermediateHandlers } from './IntermediateHandlers';
import { loginUserHandlers } from './loginUserHandlers';
import { findIdHandlers } from './findIdHandlers';

export const handlers = [
  ...signUpHandlers,
  ...postHandlers,
  ...userHandlers,
  ...loginHandlers,
  ...intermediateHandlers,
  ...loginUserHandlers,
  ...findIdHandlers,
];
