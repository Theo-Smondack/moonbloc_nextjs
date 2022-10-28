import '../styles/globals.css'
import "@fortawesome/fontawesome-svg-core/styles.css"
import {config} from "@fortawesome/fontawesome-svg-core";

config.autoAddCss = false;
import {ThemeProvider} from "next-themes";
import {CurrencyProvider} from "../context/currency";



function MyApp({Component, pageProps}) {
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
