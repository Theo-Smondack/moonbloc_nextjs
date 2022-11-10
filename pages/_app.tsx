import '../styles/globals.css'
import "@fortawesome/fontawesome-svg-core/styles.css"
import {config} from "@fortawesome/fontawesome-svg-core";

config.autoAddCss = false;
import {ThemeProvider} from "next-themes";

import {AppProps} from "next/app";
import {ReactElement, ReactNode} from "react";
import {NextPage} from "next";
import CurrencyProvider from "../context/currency";


export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}



function MyApp({Component, pageProps} : AppPropsWithLayout) {
    // Use the layout defined at the page level, if available
    const getLayout = Component.getLayout || ((page) => page)

    return (
        <ThemeProvider defaultTheme="system">
            <CurrencyProvider>
                {getLayout(<Component {...pageProps}/>)}
            </CurrencyProvider>
        </ThemeProvider>
    )
}

export default MyApp
