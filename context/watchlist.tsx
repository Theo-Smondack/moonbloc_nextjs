import { WatchlistContextType, WatchlistState } from '../types/watchlist';
import React, { createContext, useContext, useState } from 'react';
import { IProps } from '../types/props';

const WatchlistContext = createContext<WatchlistContextType | null>(null)


const WatchlistProvider = ({ children }: IProps) => {
    const [watchlist, setWatchlist] = useState<WatchlistState>([])
    const value = {
        watchlist: watchlist,
        setWatchlist: setWatchlist,
    }
    return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>
}

export function useWatchlistContext() {
    return useContext(WatchlistContext) as WatchlistContextType
}

export default WatchlistProvider