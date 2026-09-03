<?php
/**
 * Digital Udyog Seva - Production React Application Loader
 * Seamlessly serves the production React build on Apache / Hostinger / cPanel / LiteSpeed
 */

// If request is for an existing static file in /assets, /dist, /uploads or /api, let web server handle it
$requestUri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);

if (strpos($requestUri, '/api/') === 0) {
    // Let API scripts execute
    return false;
}

$distPath = __DIR__ . '/dist';
$distIndex = $distPath . '/index.html';

if (file_exists($distIndex)) {
    $html = file_get_contents($distIndex);

    // Make sure asset paths resolve correctly to /dist/assets/
    $html = str_replace('src="/assets/', 'src="/dist/assets/', $html);
    $html = str_replace('href="/assets/', 'href="/dist/assets/', $html);

    header('Content-Type: text/html; charset=UTF-8');
    header('X-Powered-By: Digital Udyog Seva Enterprise React');
    echo $html;
    exit;
} else {
    header('Content-Type: text/html; charset=UTF-8');
    echo '<!DOCTYPE html><html><head><title>Digital Udyog Seva</title></head><body style="font-family:sans-serif;text-align:center;padding:50px;"><h2>Digital Udyog Seva</h2><p>Please run <code>npm run build</code> to generate the production React build in /dist directory.</p></body></html>';
    exit;
}
