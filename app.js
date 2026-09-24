const GITHUB_USER = 'eldex0';

const translations = {
  fr: {
    navProjects: 'Projets', navContact: 'Contact', eyebrow: 'Je construis en public',
    heroLineOne: 'Coder. Apprendre.', heroLineTwo: 'Rester curieux.',
    heroIntro: 'Je code pendant mon temps libre et je partage les projets que je construis en chemin — expériences, outils utiles et idées open source.',
    viewProjects: 'Voir les projets', sectionKicker: 'Dernières créations', projectsTitle: 'Projets open source',
    allOnGithub: 'Tout voir sur GitHub', loading: 'Chargement des projets depuis GitHub…',
    loaded: '{count} projets synchronisés depuis GitHub', fallback: 'Aperçu local — GitHub est momentanément indisponible',
    contactKicker: 'Discutons', contactTitle: 'Une idée qui mérite d’être construite ?',
    contactBody: 'Collaboration open source, opportunité future ou projet freelance — vous trouverez tous les moyens de me joindre au même endroit.',
    contactButton: 'Me contacter', footer: 'Construit avec curiosité. Code disponible sur',
    noDescription: 'Projet open source disponible sur GitHub.', updated: 'Mis à jour', repository: 'Ouvrir {name} sur GitHub'
  },
  en: {
    navProjects: 'Projects', navContact: 'Contact', eyebrow: 'Building in public',
    heroLineOne: 'Code. Learn.', heroLineTwo: 'Stay curious.',
    heroIntro: 'I code in my free time and share the projects I build along the way — experiments, useful tools, and open-source ideas.',
    viewProjects: 'View projects', sectionKicker: 'Latest work', projectsTitle: 'Open-source projects',
    allOnGithub: 'All on GitHub', loading: 'Loading projects from GitHub…',
    loaded: '{count} projects synced from GitHub', fallback: 'Local preview — GitHub is temporarily unavailable',
    contactKicker: 'Say hello', contactTitle: 'Have an idea worth building?',
    contactBody: 'Open-source collaborations, future opportunities, or a freelance project — you’ll find every way to reach me in one place.',
    contactButton: 'Contact me', footer: 'Built with curiosity. Code available on',
    noDescription: 'Open-source project available on GitHub.', updated: 'Updated', repository: 'Open {name} on GitHub'
  }
};

const fallbackRepos = [
  {
    name: 'Kitten-Vault',
    html_url: 'https://github.com/eldex0/Kitten-Vault',
    description: 'Kitten Vault is an offline password manager that securely stores passwords, notes, TOTP codes, and encrypted attachments in a local vault.',
    language: 'Python', stargazers_count: 0, forks_count: 0, updated_at: '2026-09-24T17:06:14Z', fork: false, archived: false
  },
  {
    name: 'Open-Kitten',
    html_url: 'https://github.com/eldex0/Open-Kitten',
    description: 'Open Kitten is an experimental web browser built with Python, PyQt6, and QtWebEngine to explore privacy tools, customization, extensions, profiles, and search engines.',
    language: 'Python', stargazers_count: 0, forks_count: 0, updated_at: '2026-09-23T14:49:53Z', fork: false, archived: false
  }
];

const languageColors = { Python: '#4584b6', JavaScript: '#f1e05a', TypeScript: '#3178c6', HTML: '#e34c26', CSS: '#563d7c', TeX: '#3d6117', Shell: '#89e051' };
let currentLanguage = localStorage.getItem('kittencode-language') || (navigator.language.toLowerCase().startsWith('fr') ? 'fr' : 'en');
let repos = fallbackRepos;
let usingFallback = true;

function translate(key, values = {}) {
  let value = translations[currentLanguage][key] || translations.en[key] || key;
  Object.entries(values).forEach(([name, replacement]) => { value = value.replace(`{${name}}`, replacement); });
  return value;
}

function setLanguage(language) {
  currentLanguage = language;
  localStorage.setItem('kittencode-language', language);
  document.documentElement.lang = language;
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = translate(element.dataset.i18n);
  });
  document.querySelector('[data-lang-label]').textContent = language === 'fr' ? 'EN' : 'FR';
  document.querySelector('.language-toggle').setAttribute('aria-label', language === 'fr' ? 'Switch to English' : 'Passer en français');
  renderRepos();
  updateStatus();
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat(currentLanguage === 'fr' ? 'fr-FR' : 'en-GB', { month: 'short', year: 'numeric' }).format(new Date(dateString));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}

function renderRepos() {
  const grid = document.querySelector('[data-repo-grid]');
  grid.innerHTML = repos.map((repo) => {
    const language = repo.language || 'Code';
    const description = repo.description || translate('noDescription');
    const color = languageColors[language] || '#9c6cff';
    return `
      <article class="project-card">
        <div class="project-card-top">
          <div class="project-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M4 6.5 12 3l8 3.5v11L12 21l-8-3.5Z"/><path d="m4 6.5 8 4 8-4M12 10.5V21"/></svg>
          </div>
          <div class="project-arrow" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="M5 15 15 5M8 5h7v7"/></svg></div>
        </div>
        <h3>${escapeHtml(repo.name)}</h3>
        <p>${escapeHtml(description)}</p>
        <div class="project-meta">
          <span><span class="language-dot" style="--language-color:${color}"></span>${escapeHtml(language)}</span>
          <span><svg viewBox="0 0 20 20"><path d="m10 2.5 2.2 4.46 4.92.72-3.56 3.47.84 4.9L10 13.73l-4.4 2.32.84-4.9-3.56-3.47 4.92-.72Z"/></svg>${repo.stargazers_count || 0}</span>
          <span>${translate('updated')} ${formatDate(repo.updated_at)}</span>
        </div>
        <a class="project-card-link" href="${escapeHtml(repo.html_url)}" target="_blank" rel="noreferrer" aria-label="${escapeHtml(translate('repository', { name: repo.name }))}"></a>
      </article>`;
  }).join('');
}

function updateStatus() {
  const status = document.querySelector('.repo-status');
  const loader = status.querySelector('.loader');
  loader.hidden = true;
  status.querySelector('[data-status-text]').textContent = usingFallback ? translate('fallback') : translate('loaded', { count: repos.length });
}

async function loadRepos() {
  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`, {
      headers: { Accept: 'application/vnd.github+json' }
    });
    if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
    const data = await response.json();
    repos = data.filter((repo) => !repo.fork && !repo.archived).sort((a, b) => new Date(b.pushed_at || b.updated_at) - new Date(a.pushed_at || a.updated_at));
    usingFallback = false;
  } catch (error) {
    console.warn('Using the local repository snapshot.', error);
    repos = fallbackRepos;
    usingFallback = true;
  }
  renderRepos();
  updateStatus();
}

document.querySelector('.language-toggle').addEventListener('click', () => setLanguage(currentLanguage === 'fr' ? 'en' : 'fr'));
setLanguage(currentLanguage);
loadRepos();
