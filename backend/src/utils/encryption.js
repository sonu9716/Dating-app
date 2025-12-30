const crypto = require('crypto');

// Generate ECDH key pair for E2E encryption
exports.generateKeyPair = async () => {
  return new Promise((resolve, reject) => {
    crypto.generateKeyPair('ec', {
      namedCurve: 'prime256v1',
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    }, (err, publicKey, privateKey) => {
      if (err) reject(err);
      else resolve({ publicKey, privateKey });
    });
  });
};

// Encrypt message with AES-256-GCM
exports.encryptMessage = (message, sharedSecret) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', sharedSecret, iv);
  
  let encrypted = cipher.update(message, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  };
};

// Decrypt message
exports.decryptMessage = (encrypted, sharedSecret, iv, authTag) => {
  try {
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      sharedSecret,
      Buffer.from(iv, 'hex')
    );
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (err) {
    throw new Error('Decryption failed: ' + err.message);
  }
};

// Derive shared secret from two public keys (ECDH)
exports.deriveSharedSecret = (publicKey1, publicKey2) => {
  const ecdh = crypto.createECDH('prime256v1');
  ecdh.setPrivateKey(publicKey1);
  const sharedSecret = ecdh.computeSecret(publicKey2);
  return sharedSecret;
};
