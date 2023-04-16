import mongoose from 'mongoose';
import consola from 'consola';
import q from 'q';

export const dbConn = (): void => {
    mongoose.Promise = q.Promise;

    const connOption: mongoose.ConnectOptions = {};

    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, connOption);

    mongoose.connection.on('connecting', () =>
        consola.info('database connecting')
    );
    mongoose.connection.on('connected', () =>
        consola.success('database connected')
    );
    mongoose.connection.on('disconnecting', () =>
        consola.info('database disconnecting')
    );
    mongoose.connection.on('disconnected', () =>
        consola.info('database disconnected')
    );
    mongoose.connection.on('error', () => consola.error('database error'));
};

export const dbClose = () => {
    mongoose.connection.close();
};
