"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { evaluate } from "mathjs"
import { Toggle } from "@/components/ui/toggle"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Zap } from 'lucide-react'

interface CalculatorProps {
  onThemeChange: (isDark: boolean) => void
}

const buttons = [
  "C", "±", "%", "÷",
  "7", "8", "9", "×",
  "4", "5", "6", "-",
  "1", "2", "3", "+",
  "0", ".", "=",
]

const scientificButtons = [
  "sin", "cos", "tan",
  "log", "ln", "^",
  "(", ")", "π", "e",
  "√", "x²", "x³", "x!"
]

export default function Calculator({ onThemeChange }: CalculatorProps) {
  const [display, setDisplay] = useState("0")
  const [isScientific, setIsScientific] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [lastOperation, setLastOperation] = useState<string | null>(null)

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    setIsDarkMode(prefersDark)
    onThemeChange(prefersDark)
  }, [onThemeChange])

  const handleButtonClick = (value: string) => {
    setDisplay((prev) => {
      if (prev === "0" || prev === "Error") {
        return value
      }
      return prev + value
    })
    setLastOperation(value)
  }

  const calculateResult = () => {
    try {
      const result = evaluate(display.replace("×", "*").replace("÷", "/"))
      setDisplay(result.toString())
    } catch (error) {
      setDisplay("Error")
    }
  }

  const handleSpecialFunction = (func: string) => {
    switch (func) {
      case "C":
        setDisplay("0")
        break
      case "±":
        setDisplay((prev) => (parseFloat(prev) * -1).toString())
        break
      case "%":
        setDisplay((prev) => (parseFloat(prev) / 100).toString())
        break
      case "=":
        calculateResult()
        break
      case "π":
        handleButtonClick(Math.PI.toString())
        break
      case "e":
        handleButtonClick(Math.E.toString())
        break
      case "√":
        setDisplay((prev) => Math.sqrt(parseFloat(prev)).toString())
        break
      case "x²":
        setDisplay((prev) => Math.pow(parseFloat(prev), 2).toString())
        break
      case "x³":
        setDisplay((prev) => Math.pow(parseFloat(prev), 3).toString())
        break
      case "x!":
        setDisplay((prev) => {
          const factorial = (n: number): number => {
            if (n === 0 || n === 1) return 1
            return n * factorial(n - 1)
          }
          return factorial(parseInt(prev)).toString()
        })
        break
      default:
        handleButtonClick(func)
    }
    setLastOperation(func)
  }

  const handleThemeToggle = () => {
    setIsDarkMode((prev) => {
      const newTheme = !prev
      onThemeChange(newTheme)
      return newTheme
    })
  }

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${
      isDarkMode ? "from-gray-900 to-indigo-900" : "from-blue-200 to-purple-300"
    } transition-colors duration-500`}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`p-8 rounded-3xl shadow-2xl ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } transition-colors duration-500 backdrop-blur-lg bg-opacity-80`}
      >
        <div className="flex justify-between items-center mb-6">
          <Toggle
            pressed={isScientific}
            onPressedChange={setIsScientific}
            aria-label="Toggle scientific mode"
            className="bg-blue-500 data-[state=on]:bg-green-500 transition-colors duration-300"
          >
            <Zap className="h-4 w-4 mr-2" />
            {isScientific ? "Scientific" : "Standard"}
          </Toggle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleThemeToggle}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-300"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
        <motion.div
          layout
          className={`mb-6 p-6 text-right text-4xl font-bold rounded-2xl ${
            isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800"
          } transition-colors duration-500 overflow-hidden`}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={display}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="inline-block"
            >
              {display}
            </motion.span>
          </AnimatePresence>
        </motion.div>
        <div className="grid grid-cols-4 gap-3">
          {buttons.map((btn) => (
            <motion.button
              key={btn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 text-xl font-semibold rounded-2xl ${
                isDarkMode
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              } transition-colors duration-300 ${btn === "=" ? "col-span-2" : ""} ${
                lastOperation === btn ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => handleSpecialFunction(btn)}
            >
              {btn}
            </motion.button>
          ))}
        </div>
        <AnimatePresence>
          {isScientific && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 grid grid-cols-4 gap-3"
            >
              {scientificButtons.map((btn) => (
                <motion.button
                  key={btn}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-4 text-xl font-semibold rounded-2xl ${
                    isDarkMode
                      ? "bg-gray-700 text-white hover:bg-gray-600"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  } transition-colors duration-300 ${
                    lastOperation === btn ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => handleSpecialFunction(btn)}
                >
                  {btn}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

