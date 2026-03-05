import cryptoJs from 'crypto-js';

export const encryptItem = <T>(item: T, key: string): string => {
  const encryptedText = cryptoJs.AES.encrypt(
    JSON.stringify(item),
    key,
  ).toString();
  return encryptedText;
};

export const decryptItem = <T>(
  encryptedItem: string,
  key: string,
): T | null => {
  const bytes = cryptoJs.AES.decrypt(encryptedItem, key);
  const decryptedText = bytes.toString(cryptoJs.enc.Utf8);

  if (!decryptedText) {
    return null;
  }

  try {
    return JSON.parse(decryptedText) as T;
  } catch {
    return decryptedText as unknown as T;
  }
};
