import { Link } from "wouter";
import { SettingsDialog } from "./settings-dialog";

export function Navbar() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">
              <Link href="/" className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                Wiki Truth
              </Link>
            </h1>
            <span className="text-sm text-gray-500 dark:text-gray-400">Privacy-first comparison</span>
          </div>
          <nav className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/search" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Search</Link>
              <Link href="/recent" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">History</Link>
              <Link href="/help" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Help</Link>
              <Link href="/about" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">About</Link>
            </div>
            <div className="flex items-center space-x-3">
              <SettingsDialog />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
