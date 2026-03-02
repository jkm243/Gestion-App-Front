import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'default-secret-key-change-in-production';

export const encryptionService = {
  encrypt(data: any): string {
    try {
      const json = JSON.stringify(data);
      return CryptoJS.AES.encrypt(json, ENCRYPTION_KEY).toString();
    } catch (error) {
      console.error('Encryption error:', error);
      return '';
    }
  },

  decrypt(encrypted: string): any {
    try {
      const decrypted = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    }
  },

  setEncrypted(key: string, data: any): void {
    const encrypted = this.encrypt(data);
    localStorage.setItem(key, encrypted);
  },

  getEncrypted(key: string): any {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;
    return this.decrypt(encrypted);
  },

  removeEncrypted(key: string): void {
    localStorage.removeItem(key);
  },
};
