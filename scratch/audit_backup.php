<?php
require_once __DIR__ . '/../db.php';

echo "=== DATABASE AUDIT START ===" . PHP_EOL;

if (!$conn || $conn->connect_error) {
    echo "ERROR: Unable to connect to database: " . ($conn ? $conn->connect_error : "Connection object is null") . PHP_EOL;
    exit(1);
}

echo "Database Connected: host={$host}, db={$dbname}" . PHP_EOL;

// 1. List all tables and row counts
$result = $conn->query("SHOW TABLES");
$tables = [];
while ($row = $result->fetch_row()) {
    $tables[] = $row[0];
}

echo "Found " . count($tables) . " tables in database '{$dbname}':" . PHP_EOL;
$totalRows = 0;
foreach ($tables as $table) {
    $countRes = $conn->query("SELECT COUNT(*) as cnt FROM `{$table}`");
    $cnt = $countRes ? $countRes->fetch_assoc()['cnt'] : 0;
    $totalRows += $cnt;
    echo "- {$table}: {$cnt} rows" . PHP_EOL;
}
echo "Total Records across all tables: {$totalRows}" . PHP_EOL;

// 2. Perform mysqldump backup
$backupDir = __DIR__ . '/../backups';
if (!is_dir($backupDir)) {
    mkdir($backupDir, 0777, true);
}
$backupFile = $backupDir . '/backup_dus_pre_upgrade_' . date('Ymd_His') . '.sql';

echo PHP_EOL . "Creating full mysqldump to: {$backupFile}" . PHP_EOL;
$mysqldumpPath = 'c:\xampp\mysql\bin\mysqldump.exe';
$cmd = "\"{$mysqldumpPath}\" -h {$host} -u {$user} " . ($password ? "-p\"{$password}\" " : "") . "{$dbname} > \"{$backupFile}\"";

exec($cmd, $output, $returnVar);

if ($returnVar === 0 && file_exists($backupFile) && filesize($backupFile) > 0) {
    echo "SUCCESS: Database backup created successfully (" . round(filesize($backupFile) / 1024, 2) . " KB)" . PHP_EOL;
} else {
    echo "WARNING: mysqldump exited with code {$returnVar}. Fallback PHP dump starting..." . PHP_EOL;
    // Fallback PHP dumper
    $fp = fopen($backupFile, 'w');
    fwrite($fp, "-- Digital Udyog Seva Database Backup\n-- Date: " . date('Y-m-d H:i:s') . "\n\n");
    foreach ($tables as $t) {
        $createRes = $conn->query("SHOW CREATE TABLE `{$t}`");
        $createRow = $createRes->fetch_row();
        fwrite($fp, "DROP TABLE IF EXISTS `{$t}`;\n" . $createRow[1] . ";\n\n");
        $rowsRes = $conn->query("SELECT * FROM `{$t}`");
        while ($r = $rowsRes->fetch_assoc()) {
            $vals = array_map(function($v) use ($conn) {
                return $v === null ? 'NULL' : "'" . $conn->real_escape_string($v) . "'";
            }, array_values($r));
            fwrite($fp, "INSERT INTO `{$t}` VALUES (" . implode(", ", $vals) . ");\n");
        }
        fwrite($fp, "\n");
    }
    fclose($fp);
    echo "SUCCESS: PHP Fallback database backup created successfully (" . round(filesize($backupFile) / 1024, 2) . " KB)" . PHP_EOL;
}

echo "=== DATABASE AUDIT COMPLETE ===" . PHP_EOL;
