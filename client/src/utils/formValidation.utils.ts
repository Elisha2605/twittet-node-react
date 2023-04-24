const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

export const validateFileExtension = (value: any | null) => {
    if (!value || !value[0]) {
        return true;
    }

    const fileName = value[0].name;
    const extension = fileName.substr(fileName.lastIndexOf('.') + 1);

    return allowedExtensions.includes(extension);
};