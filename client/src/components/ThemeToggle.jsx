'use client'
import { useTheme } from '../context/ThemeContext';
import { MdDarkMode } from "react-icons/md";
import { MdOutlineLightMode } from "react-icons/md";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className=" text-[16px] text-green-600 rounded-full p-1 border border-green-800"
    >
      {theme === 'light' ? <MdDarkMode />
 : <MdOutlineLightMode />
}
    </button>
  );
};

export default ThemeToggle;
