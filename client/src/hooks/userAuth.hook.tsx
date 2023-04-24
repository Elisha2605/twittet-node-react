import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/user.context';

function useAuthUser() {
    const [authUser, setAuthUser] = useState(null);
    const { me } = useContext(AuthContext);

    useEffect(() => {
        if (me) {
            me().then((user) => setAuthUser(user));
        }
    }, [me]);

    return authUser;
}

export default useAuthUser;
