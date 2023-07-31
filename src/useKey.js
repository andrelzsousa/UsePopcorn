import { useEffect } from 'react'

export function useKey(key, action) {
    useEffect(() => {

        function callback(e) {
            if (e.code === key) {
                action()
            }
        }

        document.addEventListener('keydown', callback)

        return () => {document.removeEventListener('keydown', callback) }
    }, [key, action])
}