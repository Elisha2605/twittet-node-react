import { useState, useEffect, useContext, useCallback } from 'react';
import AuthContext from '../context/user.context';

function useAuthUser() {
    const [authUser, setAuthUser] = useState(null);
    const { me } = useContext(AuthContext);

    const memoizedMe = useCallback(() => {
        if (me) {
            me().then((res) => setAuthUser(res.user));
        }
    }, [me]);

    useEffect(() => {
        memoizedMe();
    }, [memoizedMe]);

    return authUser;
}

export default useAuthUser;