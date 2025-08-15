import { useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  const setValue = (_value: T | ((_val: T) => T)) => {
    try {
      const valueToStore = _value instanceof Function ? _value(storedValue) : _value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      // TODO: Handle localStorage error
    }
  }

  return [storedValue, setValue]
}
