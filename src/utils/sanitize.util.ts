import type { Sanitized, SanitizeOptions } from '../types/types';
import xss from 'xss';

/**
 * Sanitizes the provided data by applying XSS filtering and returning a copy of the data with all properties and values set as readonly.
 *
 * @param data The data to be sanitized.
 * @param options The options to configure the XSS filtering process.
 *
 * @returns A sanitized copy of the provided data with all properties and values set as readonly.
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const sanitize = <T extends unknown>(
  data: T,
  options?: SanitizeOptions
): Sanitized<T> => {
  // If data is falsy, return as is
  if (!data) {
    return data as unknown as Sanitized<T>;
  }

  // If data is an array, sanitize each item in the array and return the sanitized array
  if (Array.isArray(data)) {
    const sanitizedArray = data.map((item) =>
      sanitize(item, options)
    ) as unknown as Sanitized<T>;
    return sanitizedArray;
  }

  // If data is an object, sanitize each property value in the object and return the sanitized object
  if (typeof data === 'object' && data !== null) {
    const sanitizedObject = {} as { [K in keyof T]: Sanitized<T[K]> };

    // Sanitize each property value in the object
    for (const [key, value] of Object.entries(data)) {
      sanitizedObject[key as keyof T] = sanitize(value, options);
    }
    return sanitizedObject as Sanitized<T>;
  }

  // If data is a string, apply XSS filtering and return the sanitized string
  if (typeof data === 'string') {
    const xssOptions: SanitizeOptions = {
      stripIgnoreTagBody: options?.stripIgnoreTagBody ?? false,
      whiteList: options?.whiteList ?? {},
      ...options
    };
    return xss(data, xssOptions) as Sanitized<T>;
  }

  // If data is not an array, object, or string, return as is
  return data as Sanitized<T>;
};
