import { FormControl, FormGroup } from '@angular/forms';
import { fieldsMatch } from './fields-match';

describe('fieldsMatch', () => {
  it('sets mismatch error when fields differ', () => {
    const validator = fieldsMatch('password', 'confirmPassword');
    const group = new FormGroup({
      password: new FormControl('abc'),
      confirmPassword: new FormControl('xyz'),
    });

    validator(group);

    expect(group.get('confirmPassword')?.hasError('mismatch')).toBe(true);
  });

  it('removes mismatch while keeping other errors when fields match', () => {
    const validator = fieldsMatch('password', 'confirmPassword');
    const group = new FormGroup({
      password: new FormControl('same'),
      confirmPassword: new FormControl('same'),
    });

    const confirm = group.get('confirmPassword');
    confirm?.setErrors({ mismatch: true, required: true });

    validator(group);

    expect(confirm?.hasError('mismatch')).toBe(false);
    expect(confirm?.hasError('required')).toBe(true);
  });

  it('returns null when one of the controls does not exist', () => {
    const validator = fieldsMatch('password', 'confirmPassword');
    const group = new FormGroup({
      password: new FormControl('abc'),
    });

    expect(validator(group)).toBeNull();
  });
});
