import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [fileType, setFileType] = useState('');
  const [resType, setResType] = useState('');
  const [engine, setEngine] = useState('google');
  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState([]);
  const [minSize, setMinSize] = useState('');
  const [maxSize, setMaxSize] = useState('');
  const [afterDate, setAfterDate] = useState('');

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setHistory(savedHistory);
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    document.body.classList.toggle('dark', savedDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    document.body.classList.toggle('dark', newDarkMode);
  };

  const setFiletype = (ft, rt, glyph) => {
    setFileType(ft);
    setResType(rt);
    // placeholder logic
  };

  const setEngineFunc = (eng) => {
    setEngine(eng);
  };

  const startSearch = () => {
    let finalQuery = query;
    if (fileType) {
      finalQuery += ` filetype:${fileType}`;
    }
    if (minSize) finalQuery += ` size:>${minSize}`;
    if (maxSize) finalQuery += ` size:<${maxSize}`;
    if (afterDate) finalQuery += ` after:${afterDate}`;

    let url = '';
    switch (engine) {
      case 'google':
        url = `https://www.google.com/search?q=${encodeURIComponent(finalQuery + ' -inurl:(jsp|pl|php|html|aspx|htm|cf|shtml) intitle:index.of')}`;
        break;
      // add others
      default:
        url = `https://www.google.com/search?q=${encodeURIComponent(finalQuery)}`;
    }
    window.open(url, '_blank');

    const newHistory = [query, ...history.slice(0, 9)];
    setHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-400 to-purple-600 text-black'}`}>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto p-8"
      >
        <motion.h1
          className="text-center text-4xl font-bold mb-8"
          whileHover={{ scale: 1.05 }}
        >
          Open Directory Search
        </motion.h1>
        <motion.div
          className={`p-8 rounded-lg shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4">
            <motion.button
              onClick={toggleDarkMode}
              className="px-4 py-2 bg-blue-500 text-white rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Toggle Dark Mode
            </motion.button>
          </div>
          <div className="flex flex-wrap mb-4">
            <select className="mr-2 p-2 border rounded" onChange={(e) => setFiletype(e.target.value, 'video')}>
              <option value="">Choose Filetype</option>
              <option value="mkv|mp4">TV/Movies</option>
              <option value="mp3|flac|wav">Music</option>
              <option value="pdf|epub|mobi">Ebooks</option>
              <option value="iso|zip|rar">Software</option>
            </select>
            <select className="mr-2 p-2 border rounded">
              <option>Google</option>
              <option onClick={() => setEngineFunc('duckduckgo')}>DuckDuckGo</option>
              {/* add more */}
            </select>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search anything"
              className="flex-1 p-2 border rounded"
            />
            <motion.button
              onClick={startSearch}
              className="ml-2 px-4 py-2 bg-green-500 text-white rounded"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Search
            </motion.button>
          </div>
          <div className="flex flex-wrap mb-4">
            <input type="text" placeholder="Min size" value={minSize} onChange={(e) => setMinSize(e.target.value)} className="mr-2 p-2 border rounded" />
            <input type="text" placeholder="Max size" value={maxSize} onChange={(e) => setMaxSize(e.target.value)} className="mr-2 p-2 border rounded" />
            <input type="date" value={afterDate} onChange={(e) => setAfterDate(e.target.value)} className="p-2 border rounded" />
          </div>
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3>Recent Searches</h3>
            <ul>
              {history.map((item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 10 }}
                  className="cursor-pointer"
                  onClick={() => setQuery(item)}
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default App;