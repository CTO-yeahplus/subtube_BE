import { ERROR_INFO } from '../common/constant';
import * as lookup from "country-code-lookup";
import { BadRequestException } from '@nestjs/common';
import {BaseResDto} from "../common/base.dto";

/**
 * create common response object for application
 * @param data
 * @param metadata
 * @returns
 */
export function responseHelper<T>(
  data: T,
  success?: boolean,
  message?: string,
  code?: number,
): BaseResDto {
  const res = { code: 200, success: true, message: ERROR_INFO.SUCCESS, data: null };
  res.data = data;
  if (code) {
    res.code = code;
  }

  if (success) {
    res.success = success;
  }

  if (message) {
    res.message = message;
  }

  return res;
}

export function genFileName(name: string) {
  name = name.replaceAll(' ', '+');
  return Date.now() + '_' + Math.round(Math.random() * 1e9) + '_' + name;
}

export function genEndNameS3(name: string) {
  name = name.replaceAll(' ', '');
  name = name.replaceAll('+', '');
  name = name.replaceAll('%', '');
  name = name.replaceAll('*', '');
  return name;
}

export function isURL(str: string) {
  // Regular expression for a URL pattern
  str = str.split(' ').join('%20');
  const urlPattern = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/\S*)?$/i;
  // Test the string against the pattern
  return urlPattern.test(str);
}

export function isValidProductName(input: string): boolean {
  // Define the regular expression pattern
  const pattern = /^[\u4E00-\u9FA5a-zA-Z0-9()\/,_\-\s]*$/;

  // Test the input against the pattern
  return pattern.test(input);
}

export function convertToUpperCase(value: any): any {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  // If it's not a string, just return the original value for numbers
  return value;
}
export function isImageUrl(url: any): any {
  // Get the file extension from the URL
  const extension = url.split('.').pop();

  // List of common image file extensions
  const imageExtensions = ['jpg', 'jpeg', 'png'];

  // Check if the extension is in the list of image extensions
  return imageExtensions.includes(extension.toLowerCase());
}

export function slugify(str: any) {
  return String(str)
    .normalize('NFKD') // split accented characters into their base characters and diacritical marks
    .replace(/[\đĐ]/g, 'd') // convert đ to d
    .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .trim() // trim leading or trailing whitespace
    .toLowerCase() // convert to lowercase
    .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-'); // remove consecutive hyphens
}

export function formatPrice(price: number, digits: number) {
  return !Number.isInteger(price) ? Number(price.toFixed(digits)) : price;
}

export const getPaginationResponse = (
  entities: any[],
  total: number,
  limit = 10,
  currentPage: number,
) => {
  return {
    entities,
    pagination: {
      total,
      current_page: currentPage,
      per_page: limit,
      last_page: Math.ceil(total / limit),
    },
  };
};

export const convertFromCountryToCountryCode = (country: any) => {
  try {
    const countryCode = lookup?.byCountry(country)?.internet;
    return countryCode || 'JP'
  } catch (error) {
    throw new BadRequestException('Your country is not exist')
  }
}

export const convertToArray = (value: any) => (Array.isArray(value) ? value : [value]);

export const splitLongStrings = (arr: any) => {
  const result = [];
  for (const str of arr) {
      if (str.length > 35) {
          let commaIndex = str.lastIndexOf(",");
          if (commaIndex === -1) {
              commaIndex = 35;
          }
          const firstPart = str.slice(0, commaIndex).trim();
          const secondPart = str.slice(commaIndex + 1).trim();
          result.push(firstPart, secondPart);
      } else {
          result.push(str);
      }
  }
  return result;
}

export const convertDate = (date: Date) => {
  return (
      date?.getFullYear() +
      '-' +
      ('0' + (date?.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + date?.getDate()).slice(-2)
  );
};