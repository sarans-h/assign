import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [dark, setDark] = useState<boolean>(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const pref = saved ?? 'light'
    setDark(pref === 'dark')
    document.documentElement.classList.toggle('dark', pref === 'dark')
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    const value = next ? 'dark' : 'light'
    localStorage.setItem('theme', value)
    document.documentElement.classList.toggle('dark', next)
  }

  return (
    <button onClick={toggle} className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700">
      {dark ? 'Light Mode' : 'Dark Mode'}
    </button>
  )
}
