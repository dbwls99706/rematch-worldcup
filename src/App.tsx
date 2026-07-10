import { AnimatePresence, motion } from 'framer-motion'
import { Archive as ArchiveIcon, Home as HomeIcon } from 'lucide-react'
import { useGame } from './store/useGame'
import Home from './pages/Home'
import Briefing from './pages/Briefing'
import WarRoom from './pages/WarRoom'
import Matchday from './pages/Matchday'
import Report from './pages/Report'
import Archive from './pages/Archive'

export default function App() {
  const view = useGame((s) => s.view)
  const goHome = useGame((s) => s.goHome)
  const gotoArchive = useGame((s) => s.gotoArchive)

  return (
    <div className="app">
      <header className="topbar">
        <button className="brand" onClick={goHome} aria-label="홈으로">
          <svg className="logo" viewBox="0 0 64 64" aria-hidden>
            <rect width="64" height="64" rx="14" fill="#0a5c30" />
            <circle cx="32" cy="32" r="15" fill="none" stroke="#7defb0" strokeWidth="2.5" />
            <line x1="32" y1="6" x2="32" y2="58" stroke="#7defb0" strokeWidth="2.5" />
            <circle cx="32" cy="32" r="4.5" fill="#f59e0b" />
          </svg>
          <span>
            RE<b>MATCH</b>
          </span>
          <span className="tag">그날의 경기, 나의 전술로 다시</span>
        </button>
        <nav className="nav-actions">
          <button className="btn sm ghost" onClick={goHome}>
            <HomeIcon size={16} /> <span className="hide-sm">홈</span>
          </button>
          <button className="btn sm ghost" onClick={gotoArchive}>
            <ArchiveIcon size={16} /> <span className="hide-sm">내 기록</span>
          </button>
        </nav>
      </header>

      <AnimatePresence mode="wait">
        <motion.main
          key={view}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="container"
        >
          {view === 'home' && <Home />}
          {view === 'briefing' && <Briefing />}
          {view === 'warroom' && <WarRoom />}
          {view === 'matchday' && <Matchday />}
          {view === 'report' && <Report />}
          {view === 'archive' && <Archive />}
        </motion.main>
      </AnimatePresence>
    </div>
  )
}
