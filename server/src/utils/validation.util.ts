import { DOMAIN_CODES } from '../../src/data/country-code.data';
import { CustomError } from './helpers';

export const validate_name = (value: string) => {
    if (value.trim() === '' || value.trim() === null) {
        throw CustomError('Invalid input', 400);
    }
    return value;
};

export const validate_website = (value: string) => {
    if (value.trim() === '' || value.trim() === null) {
        return value;
    }
    // Check if website value starts with 'http://' or 'https://'
    if (!value.startsWith('http://') && !value.startsWith('https://')) {
        value = `https://${value}`;
    }
    // Check if website value ends with any of the domain codes

    const domainRegex = new RegExp(
        `^https?:\\/\\/[\\S]+\\.(${DOMAIN_CODES.join('|')})\\/?$`,
        'i'
    );

    if (!domainRegex.test(value)) {
        throw CustomError('Invalid website URL', 400);
    }

    return value;
};
