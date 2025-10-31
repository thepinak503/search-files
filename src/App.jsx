import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, Music, Video, BookOpen, Package, Settings, ChevronDown, ChevronUp, Sun, Moon } from 'lucide-react';
import './index.css'; // Use index.css for global styles

const FILE_TYPES = [
  { label: 'All', value: '', resType: '', icon: Search },
  { label: 'Video', value: 'mkv|mp4|avi|mov|mpg|wmv|divx|mpeg', resType: 'video', icon: Video },
  { label: 'Music', value: 'mp3|wav|ac3|ogg|flac|wma|m4a|aac|mod', resType: 'audio', icon: Music },
  { label: 'Ebooks', value: 'MOBI|CBZ|CBR|CBC|CHM|EPUB|FB2|LIT|LRF|ODT|PDF|PRC|PDB|PML|RB|RTF|DOC|DOCX', resType: 'ebook', icon: BookOpen },
  { label: 'Software', value: 'exe|iso|dmg|tar|7z|bz2|gz|rar|zip|apk', resType: 'archive', icon: Package },
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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Card = ({ children, className = '' }) => (
  <motion.div
    className={`glass-card p-6 sm:p-10 rounded-3xl shadow-2xl ${className}`}
    initial={{ scale: 0.95 }}
    animate={{ scale: 1 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
);

const InputField = ({ value, onChange, placeholder, type = 'text', className = '', ...props }) => {
  const isDarkMode = document.body.classList.contains('dark');
  const baseClasses = `w-full p-3 rounded-xl border-2 transition duration-300 focus:outline-none focus:ring-4 ${
    isDarkMode 
      ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/30' 
      : 'bg-white/50 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/30'
  }`;
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`${baseClasses} ${className}`}
      {...props}
    />
  );
};

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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      startSearch();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-500 to-purple-700 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl"
      >
        {/* Header */}
        <motion.header variants={itemVariants} className="text-center mb-10">
          <h1 className="text-6xl font-extrabold text-white drop-shadow-lg mb-2">
            Open Directory Finder
          </h1>
          <p className="text-xl text-white/80 font-light">
            Find direct download links with a powerful, minimalist search.
          </p>
        </motion.header>

        {/* Main Card */}
        <Card>
          {/* Dark Mode Toggle */}
          <div className="flex justify-end mb-6">
            <motion.button
              onClick={toggleDarkMode}
              className="p-3 rounded-full transition duration-300"
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-indigo-600" />}
            </motion.button>
          </div>

          {/* File Type Selection */}
          <motion.div variants={itemVariants} className="mb-8">
            <h3 className="text-lg font-semibold mb-3">File Type Filter</h3>
            <div className="flex flex-wrap gap-3">
              {FILE_TYPES.map((type) => {
                const Icon = type.icon;
                const isActive = fileType === type.value;
                return (
                  <motion.button
                    key={type.label}
                    onClick={() => setFiletypeFunc(type.value, type.resType)}
                    className={`flex items-center px-4 py-2 rounded-full font-medium transition duration-300 shadow-md ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-blue-500/50'
                        : 'bg-gray-200/50 text-gray-700 hover:bg-blue-500/70 hover:text-white dark:bg-gray-700/50 dark:text-gray-200 dark:hover:bg-blue-500/70'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {type.label}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Main Search Bar */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 mb-6">
            <InputField
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search query (e.g., 'The.Blacklist.S01' or 'K.Flay discography')"
              className="flex-grow"
            />
            <motion.button
              onClick={startSearch}
              className="px-6 py-3 bg-green-500 text-white rounded-xl font-bold shadow-lg hover:bg-green-600 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search className="w-5 h-5 inline mr-2" /> Search
            </motion.button>
          </motion.div>

          {/* Advanced Filters Toggle */}
          <motion.div variants={itemVariants} className="text-center mb-4">
            <motion.button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`flex items-center justify-center mx-auto text-sm font-medium p-2 rounded-lg ${darkMode ? 'text-blue-400 hover:bg-gray-700/50' : 'text-blue-600 hover:bg-gray-100/50'}`}
              whileHover={{ scale: 1.02 }}
            >
              {showAdvanced ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
              {showAdvanced ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
            </motion.button>
          </motion.div>

          {/* Advanced Filters (Collapsible) */}
          <motion.div
            initial={false}
            animate={{ height: showAdvanced ? 'auto' : 0, opacity: showAdvanced ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-dashed border-gray-300/50 dark:border-gray-700/50">
              <InputField type="text" placeholder="Min size (e.g. 100MB)" value={minSize} onChange={(e) => setMinSize(e.target.value)} />
              <InputField type="text" placeholder="Max size (e.g. 1GB)" value={maxSize} onChange={(e) => setMaxSize(e.target.value)} />
              <InputField type="date" value={afterDate} onChange={(e) => setAfterDate(e.target.value)} />
            </motion.div>
          </motion.div>

          {/* Engine Selection */}
          <motion.div variants={itemVariants} className="mt-8 pt-4 border-t border-gray-300/50 dark:border-gray-700/50">
            <h3 className="text-lg font-semibold mb-3">Search Engine</h3>
            <div className="flex flex-wrap gap-2">
              {ENGINES.map((eng) => {
                const isActive = engine === eng.value;
                return (
                  <motion.button
                    key={eng.value}
                    onClick={() => setEngineFunc(eng.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition duration-300 ${
                      isActive
                        ? 'bg-indigo-500 text-white shadow-indigo-500/50'
                        : 'bg-gray-200/50 text-gray-700 hover:bg-indigo-500/70 hover:text-white dark:bg-gray-700/50 dark:text-gray-200 dark:hover:bg-indigo-500/70'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {eng.label}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Recent Searches */}
          <motion.div variants={itemVariants} className="mt-8 pt-4 border-t border-gray-300/50 dark:border-gray-700/50">
            <h3 className="text-xl font-semibold mb-3">Recent Searches</h3>
            <ul className="space-y-1">
              {history.map((item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5, backgroundColor: darkMode ? '#374151' : '#f3f4f6' }}
                  className={`p-2 rounded-lg cursor-pointer transition duration-200 ${darkMode ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-100/50'}`}
                  onClick={() => setQuery(item)}
                >
                  <FileText className="w-4 h-4 inline mr-2" /> {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}

export default App;