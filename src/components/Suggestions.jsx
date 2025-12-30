import { motion, AnimatePresence } from "framer-motion";
import {MainQuestions}from "../bot"
import {useState} from "react"
export default function Suggestions({ suggestions, onSelect }) {
  const [selected,setSelected] = useState('')

  const questions = MainQuestions.filter((data) => data.name === selected)
  console.log('questions',questions)
  return (
    <div className="p-6 bg-gray-50 from-gray-50 to-gray-100 rounded-xl shadow-lg">
  <h3 className="text-lg font-semibold text-gray-700 mb-4">Try asking:</h3>

  {!selected && (

  <div className="flex flex-wrap gap-4">
    <AnimatePresence>
      {MainQuestions.map((q, i) => (
        <motion.button
          key={q}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
          onClick={() => setSelected(q.name)}
          className="bg-gradient-to-r from-gray-400 to-gray-600 text-white font-medium text-md px-6 py-3 rounded-full shadow-lg shadow-gray-500/50 hover:scale-105 hover:from-gray-300 hover:to-gray-500 transition-all duration-300"
        >
          {q.name}
        </motion.button>
      ))}
    </AnimatePresence>
  </div>
  )}


  <div className="flex flex-wrap gap-4">
    <AnimatePresence>
      {questions?.[0]?.subOptions.map((q, i) => (
        <motion.button
          key={q}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
          onClick={() => onSelect(q.subname)}
          className="bg-gradient-to-r from-gray-400 to-gray-600 text-white font-medium text-md px-6 py-3 rounded-full shadow-lg shadow-gray-500/50 hover:scale-105 hover:from-gray-300 hover:to-gray-500 transition-all duration-300"
        >
          {q.subname}
        </motion.button>

      ))}
      {selected && (<button className="bg-gradient-to-r from-gray-400 to-gray-600 text-white font-medium text-md px-6 py-3 rounded-full shadow-lg shadow-gray-500/50 hover:scale-105 hover:from-gray-300 hover:to-gray-500 transition-all duration-300" onClick={()=> setSelected("")}>Back</button>
) }
    </AnimatePresence>
  </div>
</div>


  );
}
