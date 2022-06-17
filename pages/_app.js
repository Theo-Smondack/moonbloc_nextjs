import '../styles/globals.css'
import "@fortawesome/fontawesome-svg-core/styles.css"
import {config} from "@fortawesome/fontawesome-svg-core";

config.autoAddCss = false;
import {ThemeProvider} from "next-themes";


function MyApp({Component, pageProps}) {
    // Use the layout defined at the page level, if available
    const getLayout = Component.getLayout || ((page) => page)

    return getLayout(
        <ThemeProvider defaultTheme="system">
            <Component {...pageProps} />
        </ThemeProvider>
    )
}

export default MyApp
