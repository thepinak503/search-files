import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './App.css';

const FILE_TYPES = [
  { label: 'All', value: '', resType: '' },
  { label: 'TV/Movies', value: 'mkv|mp4|avi|mov|mpg|wmv|divx|mpeg', resType: 'video' },
  { label: 'Music', value: 'mp3|wav|ac3|ogg|flac|wma|m4a|aac|mod', resType: 'audio' },
  { label: 'Ebooks', value: 'MOBI|CBZ|CBR|CBC|CHM|EPUB|FB2|LIT|LRF|ODT|PDF|PRC|PDB|PML|RB|RTF|DOC|DOCX', resType: 'ebook' },
  { label: 'Software', value: 'exe|iso|dmg|tar|7z|bz2|gz|rar|zip|apk', resType: 'archive' },
];

const ENGINES = [
  { label: 'Google', value: 'google' },
  { label: 'DuckDuckGo', value: 'duckduckgo' },
  { label: 'Googol', value: 'googol' },
  { label: 'Startpage', value: 'startpage' },
  { label: 'Searx', value: 'searx' },
  { label: 'FilePursuit', value: 'filepursuit' },
  { label: 'Bing', value: 'bing' },
];

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
  const [showAdvanced, setShowAdvanced] = useState(false);

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

  const setFiletypeFunc = (ft, rt) => {
    setFileType(ft);
    setResType(rt);
  };

  const setEngineFunc = (eng) => {
    setEngine(eng);
  };

  const startSearch = () => {
    let currentFileType = fileType;
    if (currentFileType === "" && engine === "filepursuit") {
      currentFileType = "all";
    }

    let finalQuery = query;
    const commonExclusions = " -inurl:(jsp|pl|php|html|aspx|htm|cf|shtml) intitle:index.of -inurl:(listen77|mp3raid|mp3toss|mp3drug|index_of|index-of|wallywashis|downloadmana)";

    if (currentFileType && currentFileType !== "all") {
      finalQuery += ` +(${currentFileType})${commonExclusions}`;
    } else {
      finalQuery += commonExclusions;
    }

    if (minSize) finalQuery += ` size:>${minSize}`;
    if (maxSize) finalQuery += ` size:<${maxSize}`;
    if (afterDate) finalQuery += ` after:${afterDate}`;

    let url = '';
    switch (engine) {
      case 'google':
        url = `https://www.google.com/search?q=${encodeURIComponent(finalQuery)}`;
        break;
      case 'googol':
        url = `https://googol.warriordudimanche.net/?q=${encodeURIComponent(finalQuery)}`;
        break;
      case 'startpage':
        url = `https://www.startpage.com/do/dsearch?query=${encodeURIComponent(finalQuery)}`;
        break;
      case 'searx':
        url = `https://searx.me/?q=${encodeURIComponent(finalQuery)}`;
        break;
      case 'filepursuit':
        // FilePursuit uses a different query format
        url = `https://filepursuit.com/search/${query.replace(/ /g, "+")}/type/${resType || 'all'}`;
        break;
      case 'duckduckgo':
        url = `https://duckduckgo.com/?q=${encodeURIComponent(finalQuery)}`;
        break;
      case 'bing':
        url = `https://www.bing.com/search?q=${encodeURIComponent(finalQuery)}`;
        break;
      default:
        url = `https://www.google.com/search?q=${encodeURIComponent(finalQuery)}`;
    }
    window.open(url, '_blank');

    const newHistory = [query, ...history.slice(0, 9)];
    setHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const baseInputClasses = `w-full p-3 border-2 rounded-xl focus:ring-4 transition duration-200 ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500/50' : 'bg-white border-gray-300 focus:ring-blue-400/50'
  }`;
  
  const buttonBaseClasses = `px-4 py-2 rounded-full font-semibold transition duration-300 shadow-md`;
  const activeFiletypeClasses = 'bg-blue-600 text-white shadow-lg';
  const inactiveFiletypeClasses = `${darkMode ? 'bg-gray-600 text-gray-200 hover:bg-blue-500' : 'bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white'}`;
  const engineButtonClasses = `${darkMode ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-100'}`;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-400 to-purple-600 text-black'}`}>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto p-4 sm:p-8 max-w-4xl"
      >
        <motion.h1
          className="text-center text-5xl font-extrabold mb-4 text-white drop-shadow-lg"
          whileHover={{ scale: 1.05 }}
        >
          Open Directory Finder
        </motion.h1>
        <p className="text-center text-white/80 mb-8 text-lg">
          Get direct download links for almost anything.
        </p>

        <motion.div
          className={`p-6 sm:p-10 rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Dark Mode Toggle */}
          <div className="flex justify-end mb-6">
            <motion.button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-800'}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Toggle Dark Mode"
            >
              {darkMode ? '☀️' : '🌙'}
            </motion.button>
          </div>

          {/* File Type Selection (Chips) */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {FILE_TYPES.map((type) => (
              <motion.button
                key={type.label}
                onClick={() => setFiletypeFunc(type.value, type.resType)}
                className={`${buttonBaseClasses} text-sm ${fileType === type.value ? activeFiletypeClasses : inactiveFiletypeClasses}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {type.label}
              </motion.button>
            ))}
          </div>

          {/* Main Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && startSearch()}
              placeholder="Search for a file, e.g., 'The.Blacklist.S01' or 'K.Flay discography'"
              className={`${baseInputClasses} flex-grow`}
            />
            <motion.button
              onClick={startSearch}
              className="px-6 py-3 bg-green-500 text-white rounded-xl font-bold shadow-lg hover:bg-green-600 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Search
            </motion.button>
          </div>

          {/* Advanced Filters Toggle */}
          <div className="text-center mb-4">
            <motion.button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`text-sm font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
              whileHover={{ scale: 1.02 }}
            >
              {showAdvanced ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
            </motion.button>
          </div>

          {/* Advanced Filters (Collapsible) */}
          <motion.div
            initial={false}
            animate={{ height: showAdvanced ? 'auto' : 0, opacity: showAdvanced ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-dashed border-gray-300 dark:border-gray-700">
              <input type="text" placeholder="Min size (e.g. 100MB)" value={minSize} onChange={(e) => setMinSize(e.target.value)} className={baseInputClasses} />
              <input type="text" placeholder="Max size (e.g. 1GB)" value={maxSize} onChange={(e) => setMaxSize(e.target.value)} className={baseInputClasses} />
              <input type="date" value={afterDate} onChange={(e) => setAfterDate(e.target.value)} className={baseInputClasses} />
            </div>
          </motion.div>

          {/* Engine Selection */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-3">Search Engine:</h3>
            <div className="flex flex-wrap gap-2">
              {ENGINES.map((eng) => (
                <motion.button
                  key={eng.value}
                  onClick={() => setEngineFunc(eng.value)}
                  className={`border ${buttonBaseClasses} text-sm ${engine === eng.value ? 'bg-blue-500 text-white border-blue-500' : engineButtonClasses}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {eng.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Recent Searches */}
          <motion.div
            className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-xl font-semibold mb-3">Recent Searches</h3>
            <ul className="space-y-1">
              {history.map((item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5, backgroundColor: darkMode ? '#374151' : '#f3f4f6' }}
                  className={`p-2 rounded-lg cursor-pointer ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
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