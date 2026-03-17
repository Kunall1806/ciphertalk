import CryptoJS from 'crypto-js';

// Secret key — ye hamesha same rehni chahiye
const SECRET_KEY = 'CipherTalk@SecureKey#2026';

// Message ENCRYPT karo — bhejne se pehle
export function encryptMessage(message) {
  const encrypted = CryptoJS.AES.encrypt(
    message, 
    SECRET_KEY
  ).toString();
  return encrypted;
}

// Message DECRYPT karo — receive karne ke baad
export function decryptMessage(encryptedMessage) {
  try {
    const decrypted = CryptoJS.AES.decrypt(
      encryptedMessage, 
      SECRET_KEY
    );
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    return encryptedMessage;
  }
}
