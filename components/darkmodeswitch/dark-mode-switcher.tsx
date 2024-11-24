'use client';
import { Button } from "@nextui-org/react";
import { useEffect , useState } from "react";

import { MdDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";

export default function DarkModeSwitcher() {


    const [ isDarkMode, setIsDarkMode ] = useState(false);

    useEffect(() => {
        onUiLoad();
    }, [])


    const onUiLoad = () => {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark')
            setIsDarkMode(true);
        } else {
            document.documentElement.classList.remove('dark')
            setIsDarkMode(false)
        }
    }

    const toggleSwitch = () => {
        if (localStorage.theme === 'dark') {
            localStorage.theme = 'light'
        } else {
            localStorage.theme = 'dark'
        }
        onUiLoad();
    }

    return (
        <Button onClick={toggleSwitch} isIconOnly className="bg-transparent border border-gray-200 " aria-label="DarkMode Switch" >{isDarkMode ? <CiLight size={22} /> : <MdDarkMode size={22} /> }</Button>
    )
}