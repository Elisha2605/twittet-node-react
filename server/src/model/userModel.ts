export interface FormInputs {
    email: string;
    password: string;
}

export interface IUser {
    id: number;
    name: string;
    email: string;
    password: string;
}

export const User = [
    {
        id: 1,
        name: 'Aïcha Haïdara',
        email: 'a@a.com',
        password: '123',
    },
    {
        id: 2,
        name: 'Juan Doe',
        email: 'juan@example.com',
        password: 'juan123',
    },
];
