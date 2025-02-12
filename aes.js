const crypto = require('crypto');
const fs = require('fs');
const ecnryption_method = 'aes-256-cbc';

// Encrypt data
async function encryptData(fileName) {
  let data = fs.readFileSync(`${fileName}.txt`);
  let random = crypto.randomBytes(16);
  let id = random.toString('hex');
  let hash = await generateIv(id);
  const cipher = crypto.createCipheriv(ecnryption_method, id, hash)
  let encrypted = Buffer.from(cipher.update(data, 'utf8', 'hex') + cipher.final('hex'));
  return fs.writeFile(`${id}.txt`, encrypted, (err) => {
    if (err)
      console.log(err);
    else {
      console.log("File written successfully\n");
      console.log({ key: id });
      return { key: id };
    }
  });
}

// Decrypt data
async function decryptData(id) {
  let encryptedData = fs.readFileSync(`${id}.txt`);
  const buff = Buffer.from(encryptedData, 'base64');
  let hash = await generateIv(id);
  const decipher = crypto.createDecipheriv(ecnryption_method, id, hash)
  let decryptedData = decipher.update(buff.toString('utf8'), 'hex', 'utf8') +  decipher.final('utf8');
  console.log(decryptedData);
  return decryptedData;
}

// async function generatekey(id) {
//   return crypto.createHash('sha512').update(id).digest('hex').substring(0, 32);
// }

async function generateIv(id) {
  return crypto.createHash('sha512').update(id).digest('hex').substring(0, 16);
}

// encryptData("hye");
// decryptData("ab41390b6a0767c4f3016ffe3a88a3a2");