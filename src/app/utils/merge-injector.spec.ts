import { Injector } from '@angular/core';
import { MergeInjector } from './merge-injector';

describe('MergeInjector', () => {
  let firstInjector: jasmine.SpyObj<Injector>;
  let secondInjector: jasmine.SpyObj<Injector>;
  let mergeInjector: MergeInjector;

  beforeEach(() => {
    firstInjector = jasmine.createSpyObj('Injector', ['get']);
    secondInjector = jasmine.createSpyObj('Injector', ['get']);
    mergeInjector = new MergeInjector(firstInjector, secondInjector);
  });

  it('should throw error if less than two injectors are provided', () => {
    expect(() => new MergeInjector(firstInjector)).toThrow(new Error('pass at least two injectors'));
  });

  it('should get token from first injector if available', () => {
    const token = 'testToken';
    const expectedValue = 'value';
    firstInjector.get.and.returnValue(expectedValue);

    const result = mergeInjector.get(token);

    expect(result).toBe(expectedValue);
    expect(firstInjector.get).toHaveBeenCalledWith(token, MergeInjector.NOT_FOUND);
    expect(secondInjector.get).not.toHaveBeenCalled();
  });

  it('should check second injector if token not found in first', () => {
    const token = 'testToken';
    const expectedValue = 'value';
    firstInjector.get.and.returnValue(MergeInjector.NOT_FOUND);
    secondInjector.get.and.returnValue(expectedValue);

    const result = mergeInjector.get(token);

    expect(result).toBe(expectedValue);
    expect(firstInjector.get).toHaveBeenCalledWith(token, MergeInjector.NOT_FOUND);
    expect(secondInjector.get).toHaveBeenCalledWith(token, MergeInjector.NOT_FOUND);
  });

  it('should return notFoundValue if token not found in any injector', () => {
    const token = 'testToken';
    const notFoundValue = 'notFound';
    firstInjector.get.and.returnValue(MergeInjector.NOT_FOUND);
    secondInjector.get.and.returnValue(MergeInjector.NOT_FOUND);

    const result = mergeInjector.get(token, notFoundValue);

    expect(result).toBe(notFoundValue);
    expect(firstInjector.get).toHaveBeenCalledWith(token, MergeInjector.NOT_FOUND);
    expect(secondInjector.get).toHaveBeenCalledWith(token, MergeInjector.NOT_FOUND);
  });

  it('should throw error if token not found and no notFoundValue provided', () => {
    const token = 'testToken';
    firstInjector.get.and.callFake((_: unknown, notFoundValue: unknown) => {
      if (notFoundValue) {
        return notFoundValue;
      }
      throw new Error('Token not found');
    });
    secondInjector.get.and.returnValue(MergeInjector.NOT_FOUND);

    expect(() => mergeInjector.get(token)).toThrow();
    expect(firstInjector.get).toHaveBeenCalledWith(token, MergeInjector.NOT_FOUND);
    expect(secondInjector.get).toHaveBeenCalledWith(token, MergeInjector.NOT_FOUND);
    expect(firstInjector.get).toHaveBeenCalledWith(token);
  });
});
