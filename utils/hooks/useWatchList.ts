import {useWatchlistContext} from "../../context/watchlist";
import {useSession} from "next-auth/react";
import {useEffect} from "react";

const useWatchlist = () => {
    const {watchlist, setWatchlist} = useWatchlistContext();
    const {status, data} = useSession();

    useEffect(() => {
        if (status !== 'authenticated') {
            setWatchlist([])
            return
        }
        if (status === 'authenticated' && watchlist.length > 0) return
        if (data.user) {
            const userEmail = data.user.email as string
            (async () => {
                const res = await fetch(`/api/user/watchlist?email=${userEmail}`).then(res => res.json(), error => console.log(error))
                res.ok ? setWatchlist(res.watchlist) : null
            })()
        }
    }, [status])

    return {watchlist, setWatchlist}
}

export default useWatchlist