import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMoon} from "@fortawesome/free-solid-svg-icons";
import {faSun} from "@fortawesome/free-regular-svg-icons";

const ThemeSwitch = () => {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    let _faIcon = theme === "light" ? faMoon : faSun
    let _iconColor = theme === "light" ? "black" : "white"

    return (
        <button title="Switch dark/light mode" onClick={() => theme === "light"? setTheme("dark") : setTheme("light")}>
            <FontAwesomeIcon
                icon={_faIcon}
                style={{ fontSize: 21, color: _iconColor }}
            />
        </button>
    )
}

export default ThemeSwitch