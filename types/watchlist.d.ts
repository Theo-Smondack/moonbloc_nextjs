import {UserDocument} from "../models/User";

export type WatchlistState = UserDocument["watchlist"];

export type WatchlistContextType = {
    watchlist:WatchlistState;
    setWatchlist : (state:WatchlistState) => void;
}