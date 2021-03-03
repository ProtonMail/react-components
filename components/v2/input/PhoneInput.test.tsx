import { getNumber } from './PhoneInput';

describe('PhoneInput', () => {
    it('should parse number', () => {
        expect(getNumber('+', 'US')).toEqual({ countryCallingCode: '', country: '', nationalNumber: '+' });
        expect(getNumber('+1', 'US')).toEqual({ countryCallingCode: '1', country: 'US', nationalNumber: '' });
        expect(getNumber('+11', 'US')).toEqual({ countryCallingCode: '1', country: 'US', nationalNumber: '1' });
        expect(getNumber('+12', 'US')).toEqual({ countryCallingCode: '1', country: 'US', nationalNumber: '2' });
        expect(getNumber('+13', 'US')).toEqual({ countryCallingCode: '1', country: 'US', nationalNumber: '3' });
        expect(getNumber('3', 'US')).toEqual({ countryCallingCode: '1', country: 'US', nationalNumber: '3' });
        expect(getNumber('2', 'US')).toEqual({ countryCallingCode: '1', country: 'US', nationalNumber: '2' });
        expect(getNumber('1', 'US')).toEqual({ countryCallingCode: '1', country: 'US', nationalNumber: '1' });
        expect(getNumber('+41', 'US')).toEqual({ countryCallingCode: '41', country: 'CH', nationalNumber: '' });
        expect(getNumber('+411', 'US')).toEqual({ countryCallingCode: '41', country: 'CH', nationalNumber: '1' });
        expect(getNumber('+411', 'CH')).toEqual({ countryCallingCode: '41', country: 'CH', nationalNumber: '1' });
        expect(getNumber('1', 'CH')).toEqual({ countryCallingCode: '41', country: 'CH', nationalNumber: '1' });
        expect(getNumber('+42', 'CH')).toEqual({ countryCallingCode: '', country: '', nationalNumber: '+42' });
        expect(getNumber('+320', 'BE')).toEqual({ countryCallingCode: '32', country: 'BE', nationalNumber: '0' });
    });
});
