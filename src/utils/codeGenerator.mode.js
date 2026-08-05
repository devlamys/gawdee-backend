import { nanoid } from 'nanoid';

export const generateCode = (productId) => {
  return `${productId.toString().slice(-4)}-${nanoid(8)}`;
};
