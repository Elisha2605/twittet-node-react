import { useEffect, SetStateAction } from "react";

const useClickOutSide = (ref: React.RefObject<any | null>, state: React.Dispatch<SetStateAction<boolean>>) => {
     // consider creating a custom hook of this useEffect.
     useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                ref.current &&
                !ref.current.contains(event.target as Node)
            ) {
                state(false)
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

}

export default useClickOutSide;