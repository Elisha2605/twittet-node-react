import { getNewContext } from '../api/auth.api';
import React, { useCallback, useEffect, useState } from 'react';
import { getAuthUserInfo } from '../api/user.api';
import { getAuthUserFollows } from '../api/follow.api';

export interface StoredContext {
    isLoggedIn: boolean;
    token?: string | null;
    user: {
        _id: string | null;
        name: string | null;
        username: string | null;
        email: string | null;
        avatar: string | null;
        coverImage: string | null;
        isActive: boolean;
        isVerified: boolean;
        isProtected: boolean;
        createdAt: string | null;
    }
}

const DEFAULT_CONTEXT: StoredContext = {
    isLoggedIn: false,
    token: null,
    user: {
        _id: null,
        name: null,
        username: null,
        email: null,
        avatar: null,
        coverImage: null,
        isActive: false,
        isVerified: false,
        isProtected: false,
        createdAt: null,
    }
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
            if (newContext.isLoggedIn !== undefined && newContext.isLoggedIn !== null) {
                context.isLoggedIn = newContext.isLoggedIn;
            }
            if (newContext.user._id !== undefined && newContext.user._id !== null) {
                context.user._id = newContext.user._id;
            }
            if (newContext.user.name !== undefined && newContext.user.name !== null) {
                context.user.name = newContext.user.name;
            }
            if (newContext.user.username !== undefined && newContext.user.username !== null) {
                context.user.username = newContext.user.username;
            }
            if (newContext.user.email !== undefined && newContext.user.email !== null) {
                context.user.email = newContext.user.email;
            }
            if (newContext.user.avatar !== undefined && newContext.user.avatar !== null) {
                context.user.avatar = newContext.user.avatar;
            }
            if (newContext.user.coverImage !== undefined && newContext.user.coverImage !== null) {
                context.user.coverImage = newContext.user.coverImage;
            }
            if (newContext.user.isActive !== undefined && newContext.user.isActive !== null) {
                context.user.isActive = newContext.user.isActive;
            }
            if (newContext.user.isVerified !== undefined && newContext.user.isVerified !== null) {
                context.user.isVerified = newContext.user.isVerified;
            }
            if (newContext.user.isProtected !== undefined && newContext.user.isProtected !== null) {
                context.user.isProtected = newContext.user.isProtected;
            }
            if (newContext.user.createdAt !== undefined && newContext.user.createdAt !== null) {
                context.user.createdAt = newContext.user.createdAt;
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
        const ctxLoop = setInterval(retrieveContextCallback, 4 * 60 * 1000); // 4min
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