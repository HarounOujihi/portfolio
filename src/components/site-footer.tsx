export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 dark:border-neutral-800/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-neutral-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:text-neutral-400">
        <p>© {new Date().getFullYear()} Haroun Oujihi</p>
        <div className="flex gap-4">
          <a href="https://github.com/HarounOujihi" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-100 dark:hover:text-white">
            GitHub
          </a>
          <a href="https://linkedin.com/in/haroun-oujihi" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-100 dark:hover:text-white">
            LinkedIn
          </a>
          <a href="/haroun-oujihi-cv.pdf" download className="hover:text-neutral-100 dark:hover:text-white">
            CV
          </a>
        </div>
      </div>
    </footer>
  );
}
