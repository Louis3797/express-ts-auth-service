import compression from 'compression';
import type { Request, Response } from 'express';
import compressFilter from '../../src/utils/compressFilter.util';

jest.mock('compression');

describe('compressFilter', () => {
  const mockRequest = {} as Request;
  const mockResponse = {} as Response;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return false if x-no-compression header is present', () => {
    mockRequest.headers = { 'x-no-compression': 'true' };
    const result = compressFilter(mockRequest, mockResponse);
    expect(result).toBe(false);
    expect(compression.filter).not.toHaveBeenCalled();
  });

  it('should use compression.filter if x-no-compression header is not present', () => {
    mockRequest.headers = {};
    (
      compression.filter as jest.MockedFunction<typeof compression.filter>
    ).mockReturnValueOnce(true);
    const result = compressFilter(mockRequest, mockResponse);
    expect(result).toBe(true);
    expect(compression.filter).toHaveBeenCalledWith(mockRequest, mockResponse);
  });
});
