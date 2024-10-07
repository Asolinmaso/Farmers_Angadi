import crypto from "crypto";

const secretKey = 'mySecretKey';

export function encryptObject(obj) {
    const jsonString = JSON.stringify(obj);
    const cipher = crypto.createCipher('aes-256-cbc', secretKey);
    let encrypted = cipher.update(jsonString, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}
  
export function decryptObject(encryptedText) {
    const decipher = crypto.createDecipher('aes-256-cbc', secretKey);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return JSON.parse(decrypted);
}
