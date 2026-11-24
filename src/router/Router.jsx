import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const RouterContext = createContext(null);

/**
 * Normalizes a pathname by stripping subfolder base paths (e.g. /projects/digitaludyogseva.com)
 * and hash prefixes (e.g. #/admin/leads -> /admin/leads)
 */
function getNormalizedPath() {
  if (typeof window === 'undefined') return '/';

  // Support hash routing fallback if present: e.g. http://localhost/#/admin/dashboard
  const hash = window.location.hash;
  if (hash && hash.startsWith('#/')) {
    return hash.slice(1);
  }

  let pathname = window.location.pathname || '/';

  // Known subfolder bases to detect and strip
  const bases = [
    '/projects/digitaludyogseva.com',
    '/projects/dus',
    '/dus'
  ];

  for (const base of bases) {
    if (pathname.toLowerCase().startsWith(base.toLowerCase())) {
      pathname = pathname.slice(base.length);
      break;
    }
  }

  // Ensure leading slash
  if (!pathname.startsWith('/')) {
    pathname = '/' + pathname;
  }

  // Remove trailing slash if length > 1
  if (pathname.length > 1 && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }

  return pathname;
}

/**
 * Extracts the base path prefix to prepend when using window.history.pushState
 */
function getBasePath() {
  if (typeof window === 'undefined') return '';
  const pathname = window.location.pathname || '';
  const bases = [
    '/projects/digitaludyogseva.com',
    '/projects/dus',
    '/dus'
  ];
  for (const base of bases) {
    if (pathname.toLowerCase().startsWith(base.toLowerCase())) {
      return base;
    }
  }
  return '';
}

/**
 * Parses query string from window.location.search
 */
function parseQueryParams() {
  if (typeof window === 'undefined') return {};
  const search = window.location.search;
  const params = {};
  if (!search) return params;

  const urlParams = new URLSearchParams(search);
  for (const [key, value] of urlParams.entries()) {
    params[key] = value;
  }
  return params;
}

export const RouterProvider = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(getNormalizedPath);
  const [queryParams, setQueryParams] = useState(parseQueryParams);
  const basePath = useMemo(() => getBasePath(), []);

  // Listen for browser popstate (Back / Forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(getNormalizedPath());
      setQueryParams(parseQueryParams());
    };

    const handleHashChange = () => {
      setCurrentPath(getNormalizedPath());
      setQueryParams(parseQueryParams());
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Programmatic navigation
  const navigate = useCallback((to, options = {}) => {
    if (!to) return;
    
    // Check if target has query params or hash
    const [pathPart, queryPart] = to.split('?');
    let normalized = pathPart;
    if (!normalized.startsWith('/')) {
      normalized = '/' + normalized;
    }
    if (normalized.length > 1 && normalized.endsWith('/')) {
      normalized = normalized.slice(0, -1);
    }

    const fullUrl = basePath + normalized + (queryPart ? '?' + queryPart : '');

    try {
      if (options.replace) {
        window.history.replaceState({ path: normalized }, '', fullUrl);
      } else {
        window.history.pushState({ path: normalized }, '', fullUrl);
      }
    } catch (e) {
      // Fallback to hash navigation if pushState is restricted
      window.location.hash = '#' + normalized;
    }

    setCurrentPath(normalized);
    setQueryParams(queryPart ? Object.fromEntries(new URLSearchParams(queryPart)) : {});
    
    // Scroll to top on navigation unless specifically disabled
    if (!options.preventScrollReset) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [basePath]);

  // Route matching helper
  const matchPath = useCallback((pattern, testPath = currentPath) => {
    if (!pattern) return null;
    if (pattern === '*' || pattern === testPath) return { path: testPath, params: {} };

    const patternParts = pattern.split('/').filter(Boolean);
    const testParts = testPath.split('/').filter(Boolean);

    if (patternParts.length !== testParts.length) return null;

    const params = {};
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        const paramName = patternParts[i].slice(1);
        params[paramName] = decodeURIComponent(testParts[i]);
      } else if (patternParts[i] !== testParts[i]) {
        return null;
      }
    }
    return { path: testPath, params };
  }, [currentPath]);

  // Active route checking helper
  const isActive = useCallback((routePath, exact = false) => {
    if (exact) {
      return currentPath === routePath;
    }
    if (routePath === '/' || routePath === '/admin/dashboard') {
      return currentPath === routePath;
    }
    return currentPath === routePath || currentPath.startsWith(routePath + '/');
  }, [currentPath]);

  // Automatic breadcrumbs generator
  const breadcrumbs = useMemo(() => {
    const parts = currentPath.split('/').filter(Boolean);
    const crumbs = [];
    let accPath = '';

    parts.forEach((part, index) => {
      accPath += '/' + part;
      let label = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ');

      // Human-friendly labels
      if (part === 'admin') label = 'Admin ERP';
      else if (part === 'portal') label = 'Portal';
      else if (part === 'dashboard') label = 'Dashboard';
      else if (part === 'leads') label = 'Lead Management';
      else if (part === 'schemes') label = 'Government Schemes';
      else if (part === 'customers') label = 'Customers';
      else if (part === 'projects') label = 'Projects';
      else if (part === 'documents') label = 'Document Management';
      else if (part === 'attendance') label = 'Attendance';
      else if (part === 'payroll') label = 'Payroll & Salary';
      else if (part === 'scorecards') label = 'Scorecards';
      else if (part === 'eligibility') label = 'Eligibility Engine';
      else if (part === 'create') label = 'Create New';
      else if (part === 'edit') label = 'Edit';
      else if (!isNaN(part)) label = `#${part}`;

      crumbs.push({
        label,
        path: accPath,
        isLast: index === parts.length - 1
      });
    });

    return crumbs;
  }, [currentPath]);

  const value = useMemo(() => ({
    currentPath,
    queryParams,
    basePath,
    navigate,
    isActive,
    matchPath,
    breadcrumbs
  }), [currentPath, queryParams, basePath, navigate, isActive, matchPath, breadcrumbs]);

  return (
    <RouterContext.Provider value={value}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};

/**
 * Link component that intercepts clicks for SPA pushState routing
 */
export const Link = ({ to, children, className = '', style = {}, activeClassName = '', exact = false, onClick, ...rest }) => {
  const { navigate, isActive } = useRouter();
  const active = isActive(to, exact);

  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && !e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      navigate(to);
    }
  };

  const computedClassName = `${className} ${active && activeClassName ? activeClassName : ''}`.trim();

  return (
    <a 
      href={to} 
      onClick={handleClick} 
      className={computedClassName}
      style={style}
      {...rest}
    >
      {children}
    </a>
  );
};
