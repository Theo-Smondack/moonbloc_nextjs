import '../styles/globals.css'
import "@fortawesome/fontawesome-svg-core/styles.css"
import {config} from "@fortawesome/fontawesome-svg-core";

config.autoAddCss = false;
import {ThemeProvider} from "next-themes";

import {AppProps} from "next/app";
import {ReactElement, ReactNode} from "react";
import {NextPage} from "next";
import CurrencyProvider from "../context/currency";
import AuthModalProvider from "../context/authModal";
import StatusProvider from "../context/status";
import {SessionProvider} from "next-auth/react";
import Head from "next/head"
import WatchlistProvider from "../context/watchlist";
import WalletsProvider from "../context/wallets";
import {QueryClient, QueryClientProvider} from "react-query";
import {ReactQueryDevtools} from "react-query/devtools";


export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

export const siteTitle: string = 'MoonBloc';

// Create a client
const queryClient = new QueryClient();


function MyApp({Component, pageProps}: AppPropsWithLayout) {
    // Use the layout defined at the page level, if available
    const getLayout = Component.getLayout || ((page) => page)

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="system">
                <SessionProvider>
                    <StatusProvider>
                        <CurrencyProvider>
                            <WatchlistProvider>
                                <WalletsProvider>
                                    <AuthModalProvider>
                                        <Head>
                                            <title>{siteTitle}</title>
                                            <link rel="icon" href="/favicon.ico"/>
                                        </Head>
                                        {getLayout(<Component {...pageProps}/>)}
                                    </AuthModalProvider>
                                </WalletsProvider>
                            </WatchlistProvider>
                        </CurrencyProvider>
                    </StatusProvider>
                </SessionProvider>
            </ThemeProvider>
            <ReactQueryDevtools initialIsOpen={false}/>
        </QueryClientProvider>
    )
}

export default MyApp
