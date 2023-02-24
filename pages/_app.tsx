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


export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

export const siteTitle: string = 'MoonBloc';


function MyApp({Component, pageProps}: AppPropsWithLayout) {
    // Use the layout defined at the page level, if available
    const getLayout = Component.getLayout || ((page) => page)

    return (
        <ThemeProvider defaultTheme="system">
            <SessionProvider>
                <StatusProvider>
                    <CurrencyProvider>
                        <WatchlistProvider>
                            <AuthModalProvider>
                                <Head>
                                    <title>{siteTitle}</title>
                                    <link rel="icon" href="/favicon.ico"/>
                                </Head>
                                {getLayout(<Component {...pageProps}/>)}
                            </AuthModalProvider>
                        </WatchlistProvider>
                    </CurrencyProvider>
                </StatusProvider>
            </SessionProvider>
        </ThemeProvider>
    )
}

export default MyApp
