<?php
// Désactiver l'affichage des erreurs pour ne pas corrompre le JSON en cas d'avertissement PHP
ini_set('display_errors', 0);

/**
 * Serveur local PHP pour le Diagnostic de Maturité IA.
 * Sert de point d'entrée unique (routeur) :
 * - Redirige vers /app/ par défaut
 * - POST index.php?action=submit : Enregistre les réponses.
 * - GET  index.php?action=stats  : Renvoie les statistiques moyennes.
 */

// Configuration
$data_dir = __DIR__ . '/data';
$csv_path = $data_dir . '/stats.csv';

// Dimensions du diagnostic (identiques au script Python)
$dimensions = [
    "Connaissances"  => ["Q01", "Q02", "Q03", "Q04", "Q05"],
    "Prise en main"  => ["Q06", "Q07", "Q08", "Q09"],
    "Usages"         => ["Q10", "Q11", "Q12", "Q13", "Q14"],
    "Usages avancés" => ["Q15", "Q16", "Q17"],
    "Usages experts" => ["Q18", "Q19", "Q20"],
];

$question_ids = [];
for ($i = 1; $i <= 20; $i++) {
    $question_ids[] = sprintf("Q%02d", $i);
}

// Fonction pour envoyer une réponse JSON
function send_json($status, $data) {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// Gérer les requêtes CORS "preflight"
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    exit;
}

$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($action === 'submit' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $body = json_decode($input, true);

    if (!$body) {
        send_json(400, ["error" => "Invalid JSON payload"]);
    }

    $answers = isset($body['answers']) ? $body['answers'] : [];
    $score_total = isset($body['scoreTotal']) ? $body['scoreTotal'] : 0;
    $timestamp = date("Y-m-d-H-i");

    if (!is_dir($data_dir)) {
        mkdir($data_dir, 0755, true);
    }

    $file_exists = file_exists($csv_path);
    $handle = fopen($csv_path, 'a');
    if ($handle) {
        if (!$file_exists) {
            $header = array_merge(["timestamp"], $question_ids, ["score_total"]);
            fputcsv($handle, $header, ",", "\"", "\\");
        }

        $row = [$timestamp];
        foreach ($question_ids as $qid) {
            $row[] = isset($answers[$qid]) ? $answers[$qid] : 0;
        }
        $row[] = $score_total;

        fputcsv($handle, $row, ",", "\"", "\\");
        fclose($handle);
        send_json(201, ["status" => "ok"]);
    } else {
        send_json(500, ["error" => "Could not open CSV file for writing"]);
    }

} elseif ($action === 'stats' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!file_exists($csv_path)) {
        send_json(200, ["count" => 0, "avgScore" => null, "avgDimensions" => null]);
    }

    $rows = [];
    $header = null;
    if (($handle = fopen($csv_path, "r")) !== false) {
        // Ajout des paramètres d'échappement pour éviter les avertissements de dépréciation PHP 8.4
        while (($data = fgetcsv($handle, 1000, ",", "\"", "\\")) !== false) {
            if (!$header) {
                $header = $data;
            } else {
                $rows[] = array_combine($header, $data);
            }
        }
        fclose($handle);
    }

    $count = count($rows);
    if ($count === 0) {
        send_json(200, ["count" => 0, "avgScore" => null, "avgDimensions" => null]);
    }

    $sum_score = 0;
    foreach ($rows as $row) {
        $sum_score += (float)($row['score_total'] ?? 0);
    }
    $avg_score = $sum_score / $count;

    $avg_dimensions = [];
    foreach ($dimensions as $dim_name => $qids) {
        $dim_sum = 0;
        foreach ($rows as $row) {
            foreach ($qids as $qid) {
                $dim_sum += (float)($row[$qid] ?? 0);
            }
        }
        $dim_avg = $dim_sum / $count;
        $dim_max = count($qids);
        
        $avg_dimensions[$dim_name] = [
            "score" => round($dim_avg, 2),
            "max" => $dim_max,
            "percent" => $dim_max ? round(($dim_avg / $dim_max) * 100) : 0
        ];
    }

    send_json(200, [
        "count" => $count,
        "avgScore" => round($avg_score, 1),
        "avgDimensions" => $avg_dimensions
    ]);
} else {
    // Si aucune action n'est demandée, on agit comme un point d'entrée classique
    if (empty($action)) {
        header("Location: app/");
        exit;
    } else {
        send_json(404, ["error" => "Not found"]);
    }
}
