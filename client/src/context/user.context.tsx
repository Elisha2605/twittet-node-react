import { getNewContext } from '../api/auth.api';
import React, { useCallback, useEffect, useState } from 'react';
import { getAuthUserInfo } from '../api/user.api';

export interface StoredContext {
    isLoggedIn: boolean;
    token?: string | null;
}

const DEFAULT_CONTEXT: StoredContext = {
    isLoggedIn: false,
    token: null,
};

const AuthContext = React.createContext({
    isLoggeIn: false,
    getUserContext: (): any => {
        return;
    },
    me: async (): Promise<any> => {},
});

export const AuthContextProvider = (props: any) => {
    let [ctx, setCtx] = useState<StoredContext>(DEFAULT_CONTEXT);


    const retrieveContext = async () => {
        getNewContext().then((newContext) => {
            let context: StoredContext = ctx;
            if (
                newContext.isLoggedIn !== undefined &&
                newContext.isLoggedIn !== null
            ) {
                context.isLoggedIn = newContext.isLoggedIn;
            }
            if (newContext.token !== undefined && newContext.token !== null) {
                context.token = newContext.token;
            }
            localStorage.setItem('context', JSON.stringify(context));
            setCtx(context);
        });
    };

    const retrieveContextCallback = useCallback(
        retrieveContext,
        [retrieveContext, setCtx]
    );

    useEffect(() => {
        const ctxLoop = setInterval(retrieveContextCallback, 30 * 1000);
        return () => {
            clearInterval(ctxLoop);
        };
    }, [retrieveContextCallback]);

    const me = async () => {
        const res = await getAuthUserInfo();
        return res
    };

    const getUserContext = (): any => {
        const storedContext = JSON.parse(
            localStorage.getItem('context') as string
        );
        if (storedContext !== null) {
            return storedContext;
        } else if (ctx !== undefined) {
            return ctx;
        }
    };

    const contextValues = {
        isLoggeIn: ctx.isLoggedIn,
        getUserContext: getUserContext,
        me: me,
    };

    return (
        <AuthContext.Provider value={contextValues}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContext;