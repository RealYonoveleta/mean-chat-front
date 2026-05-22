import { FormControl } from '@angular/forms';
import { arrayMinLength } from './array-min-length';

describe('arrayMinLength', () => {
  it('returns error when value is missing', () => {
    const validator = arrayMinLength(1);
    const control = new FormControl(null);

    expect(validator(control)).toEqual({ arrayMinLength: { requiredLength: 1 } });
  });

  it('returns error when array length is below minimum', () => {
    const validator = arrayMinLength(2);
    const control = new FormControl(['a']);

    expect(validator(control)).toEqual({ arrayMinLength: { requiredLength: 2 } });
  });

  it('returns null when minimum length is met', () => {
    const validator = arrayMinLength(2);
    const control = new FormControl(['a', 'b']);

    expect(validator(control)).toBeNull();
  });
});
