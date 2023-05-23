import { domainCodes } from "../data/countryCodes";

const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

export const validateFileExtension = (value: any | null) => {
    if (!value || !value[0]) {
        return true;
    }

    const fileName = value[0].name;
    const extension = fileName.substr(fileName.lastIndexOf('.') + 1);

    return allowedExtensions.includes(extension);
};

export const validateWebsite = (value: string) => {
    if(value.trim() === '' || value.trim() === null) {
        return true
    }
    // Check if website value starts with 'http://' or 'https://'
    if (!value.startsWith('http://') && !value.startsWith('https://')) {
        value = `https://${value}`;
    }
    // Check if website value ends with any of the domain codes
    
    const domainRegex = new RegExp(
        `^https?:\\/\\/[\\S]+\\.(${domainCodes.join('|')})\\/?$`,
        'i'
    );

    if (!domainRegex.test(value)) {
        return 'Invalid website URL';
    }
    
    return true;
};

export const validateEmail = (email: string): boolean | string => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const maxLength = 100; // Maximum length you want to allow for the email
  
    if (email.length > maxLength) {
      return false; // Email exceeds the maximum length
    }
  
    return emailRegex.test(email);
};
