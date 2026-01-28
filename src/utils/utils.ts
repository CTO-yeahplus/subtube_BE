import * as path from 'path';
import * as fs from 'fs';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { sign, verify } from 'jsonwebtoken';
import { TokenContent } from '../dtos/auth.dto';
import { ValidationArguments, ValidationOptions, isNotEmpty, isString, registerDecorator } from 'class-validator';
export const PASSWORD_SALT_ROUND = 12;
const iv = crypto.randomBytes(16)
export function nowInMillis(): number {
  return Date.now();
}

// Alias for nowInMillis
export function now(): number {
  return nowInMillis();
}

export function nowInSeconds(): number {
  return (nowInMillis() / 1000) | 0;
}
export class Utils {
  /**
   * replace &0, &1,... to input valuesß
   * @param orginSrc
   * @param args
   * @returns
   */
  static printString(orginSrc: string, args: string[] = []): string {
    if (args && args.length > 0) {
      return orginSrc.replace(
        new RegExp('([\\&\\d+]+)', 'g'),
        function (_unused, index) {
          return args[index.replace('&', '')];
        },
      );
    } else {
      return orginSrc;
    }
  }

  /**
   * check exist file in path
   * @param filePath
   * @returns absolute path of file
   */
  static getAbsoluteFilePath(filePath: string): string {
    let absFilePath: string = null;
    if (filePath) {
      if (fs.existsSync(path.join(__dirname, '../../' + filePath))) {
        absFilePath = path.join(__dirname, '../../' + filePath);
      }
    }
    return absFilePath;
  }

  static paginateResponse(
    data: [any[], number],
    options: { page: number; limit: number },
  ): { data: any; pagination: any } {
    const { page, limit } = options;
    const result = data?.[0];
    // record total
    let total = data?.[1];

    // record number on a page
    // let itemPage = 0;
    // current page number
    let currentPage = 0;
    // last page number
    let lastPage = 0;
    if (result && page <= 0) {
      // get all
      // itemPage = result.length;
      currentPage = 1;
    } else if (result && result.length) {
      // get by paginate and have data
      lastPage = Math.ceil(total / limit);
      // itemPage = result.length;
      currentPage = page;
    } else {
      // get by paginate and do data
      total = 0;
      currentPage = page;
    }

    return {
      data: [...result],
      pagination: {
        current_page: +currentPage,
        per_page: +limit,
        last_page: lastPage,
        total: total,
      },
    };
  }

  static dsmResponse(data: [any[], number]): { data: any; metadata: any } {
    const result = data?.[0];
    const total = data?.[1];

    return {
      data: [...result],
      metadata: {
        total: total,
      },
    };
  }

  /**
   * apply for raw data from databaseß
   * @param src
   * @param dest
   * @param alias
   * @returns
   */
  static convertFromRscToDestination = (src: any, dest: any, alias: string) => {
    if (!src) {
      throw new Error('The resource object is undefined');
    }
    if (!dest) {
      throw new Error('The destination object is undefined');
    }
    const keys = Object.keys(src);
    keys.forEach((item) => {
      const destKey = item.replace(`${alias}_`, '');
      dest[destKey] = src[item];
    });
    return dest;
  };

  /**
   *
   * @param object
   * @param fields
   * @returns
   */
  static omit = (object: any, fields: string[]) => {
    const keys = Object.keys(object);
    keys.forEach((item) => {
      if (fields.includes(item)) {
        delete object[item];
      }
    });
    return object;
  };

  /**
   *
   * @param len
   * @returns
   */
  static generatePassword(len: number): string {
    const length = len > 0 ? len : 6;
    const alphabetString = 'abcdefghijklmnopqrstuvwxyz';
    const numberString = '0123456789';
    let password = '';
    let character = '';
    while (password.length < length) {
      const index1 =
        Math.ceil(alphabetString.length * Math.random()) * Math.random();
      const index2 =
        Math.ceil(numberString.length * Math.random()) * Math.random();

      const hole = alphabetString.charCodeAt(index1);
      character += String.fromCharCode(hole);
      character += numberString.charCodeAt(index2);

      password = character;
    }
    password = password
      .split('')
      .sort(() => {
        return 0.5 - Math.random();
      })
      .join('');
    return password.substring(0, length);
  }

  /**
   * hash password for create account information
   * @param orgPassword
   * @returns
   */
  static hashPassword(orgPassword: string) {
    return bcrypt.hashSync(orgPassword, PASSWORD_SALT_ROUND);
  }

  /**
   * compare input password during login
   * @param orgPassword
   * @param encryptedPassword
   * @returns
   */
  static comparePassword(orgPassword: string, encryptedPassword: string) {
    return bcrypt.compareSync(orgPassword, encryptedPassword);
  }

  /**
   * read json file
   * @param filePath path of json filke
   * @returns object json
   */
  static readJsonFile(filePath: string) {
    if (!filePath) {
      throw new Error('Path of file is empty');
    }
    const ext = filePath.substring(
      filePath.lastIndexOf('.') + 1,
      filePath.length,
    );
    if (ext !== 'json') {
      throw new Error('This must not json file');
    }
    const absFilePath = Utils.getAbsoluteFilePath(filePath);
    const rawData = fs.readFileSync(absFilePath);
    return JSON.parse(rawData.toString());
  }

  static isContainNumber(givenString: string) {
    return /\d/.test(givenString);
  }
}

export const hashPassword = (orgPassword: string) => {
  const encryptedPass = bcrypt.hashSync(orgPassword, 10);
  return encryptedPass;
};
export const comparePassword = (orgPassword: string, hashPassword: string) => {
  return bcrypt.compareSync(orgPassword, hashPassword);
};
export const generateToken = (
  payload: TokenContent,
  expiresIn: string,
  secretKey: string,
) => {
  return sign(payload, secretKey || '', { expiresIn: expiresIn as any });};
  
export const verifyToken = (token: string, secretKey: string) => {
  return verify(token, secretKey);
};

export const hashCrypt = async (text: string) => {
  const saltOrRounds = 10;
  const salt = await bcrypt.genSalt(saltOrRounds);
  return await bcrypt.hash(text, salt);
};

export const isLocal = () => {
  return process.env.APP_MODE == 'local';
};

export function IsNotEmptyString(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'isNotEmptyString',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: (value: any): boolean => isString(value) && isNotEmpty(value.trim()),
        defaultMessage: (validationArguments?: ValidationArguments): string => `${validationArguments.property} should not be an empty string`
      }
    })
  }
}

export function IsTagsIn(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'IsTagsIn',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: function (value: string): boolean {
          const allows = ['Hot Deals', 'Best Sellers', 'New Release'];
          const tags = value.split(';');
          for (let i = 0; i < tags.length; i++) {
            const tag = tags[i].trim();
            if (!allows.includes(tag)) {
              return false;
            }
          }
          return true;
        },
        defaultMessage: function (validationArguments?: ValidationArguments): string {
          const allows = ['Hot Deals', 'Best Sellers', 'New Release'];
          return `${validationArguments.property} should in ${allows.join(';')}`;
        }
      }
    })
  }
}

export function IsLabelsIn(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'IsLabelsIn',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: function (value: string): boolean {
          const allows = ['Toys', 'Sealed', 'Graded', 'Japanese', 'English', 'Snacks', 'Supplies', 'Manga'];
          const labels = value.split(';');
          for (let i = 0; i < labels.length; i++) {
            const label = labels[i].trim();
            if (!allows.includes(label)) {
              return false;
            }
          }
          return true;
        },
        defaultMessage: function (validationArguments?: ValidationArguments): string {
          const allows = ['Toys', 'Sealed', 'Graded', 'Japanese', 'English', 'Snacks', 'Supplies', 'Manga'];
          return `${validationArguments.property} should in ${allows.join(';')}`;
        }
      }
    })
  }
}

export const encryptHashedEmail = async(hashedEmail: string): Promise<string> => {
  const keyHash = crypto.createHash('sha256').update(process.env.SECRET_KEY_CRYPT, 'utf8').digest('base64').substr(0, 32);
  const cipher = crypto.createCipheriv(process.env.ALGORITHM, Buffer.from(keyHash), iv);
  let encrypted = cipher.update(hashedEmail, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return encrypted;
}

export const decryptHashedEmail = async(encryptedHashedEmail: string): Promise<string> => {
  const keyHash = crypto.createHash('sha256').update(process.env.SECRET_KEY_CRYPT, 'utf8').digest('base64').substr(0, 32);
  const decipher = crypto.createDecipheriv(process.env.ALGORITHM, Buffer.from(keyHash), iv);
  let decrypted = decipher.update(encryptedHashedEmail, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}