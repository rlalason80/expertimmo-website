<?php
/**
 * ============================================================
 *  Cabinet ExpertImmo | RABENIMANANA Normand
 *  Endpoint de réception du formulaire de contact
 * ============================================================
 *
 *  Reçoit les soumissions du formulaire de contact d'index.html
 *  et envoie un email structuré à l'adresse du Cabinet.
 *
 *  Sécurité :
 *  - Honeypot anti-spam (champ "website_url" doit être vide)
 *  - Vérification du consentement RGPD (Loi 2014-038)
 *  - Validation et nettoyage de tous les champs
 *  - Protection contre l'injection d'en-têtes mail (CRLF)
 *  - Rate limiting basique par IP (1 envoi / 30 secondes)
 *  - Logging des soumissions à des fins d'audit
 *
 *  Déploiement :
 *  - Placer ce fichier à la racine du site, à côté d'index.html
 *  - Vérifier les permissions : 644 (rw-r--r--)
 *  - Créer le dossier /logs/ avec permissions 755 (Apache écrit dedans)
 *  - Vérifier que la fonction mail() est activée chez Tranokala
 *
 *  ATTENTION :
 *  - Adapter la constante DESTINATAIRE ci-dessous au bon email
 *  - Activer le HTTPS sur le domaine (sinon les données transitent en clair)
 * ============================================================
 */

// ─── CONFIGURATION ──────────────────────────────────────────
define('DESTINATAIRE', 'contact@expertimmo.mg');
define('EXPEDITEUR_NOM', 'Site ExpertImmo');
define('EXPEDITEUR_EMAIL', 'noreply@expertimmo.mg'); // doit être un email du domaine
define('LOG_FILE', __DIR__ . '/logs/contact_submissions.log');
define('RATE_LIMIT_FILE', __DIR__ . '/logs/rate_limit.log');
define('RATE_LIMIT_SECONDS', 30); // 1 envoi par IP toutes les 30 secondes
define('MAX_FIELD_LENGTH', 2000); // longueur max par champ
define('MAX_MESSAGE_LENGTH', 5000);

// ─── EN-TÊTES DE RÉPONSE ────────────────────────────────────
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');

// ─── FONCTION : Renvoyer une réponse JSON et arrêter ────────
function reponse($success, $message, $code = 200) {
    http_response_code($code);
    echo json_encode([
        'success' => $success,
        'message' => $message,
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// ─── FONCTION : Nettoyer une chaîne contre l'injection CRLF ──
function nettoyer($val, $maxLen = MAX_FIELD_LENGTH) {
    if (!is_string($val)) return '';
    // Retire les caractères de contrôle CR/LF (protection injection en-tête)
    $val = str_replace(["\r", "\n", "\0", "%0a", "%0d", "%0A", "%0D"], '', $val);
    $val = trim($val);
    if (strlen($val) > $maxLen) {
        $val = substr($val, 0, $maxLen);
    }
    return $val;
}

// ─── FONCTION : Logger une soumission ───────────────────────
function loguer($message) {
    $log_dir = dirname(LOG_FILE);
    if (!is_dir($log_dir)) {
        @mkdir($log_dir, 0755, true);
    }
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'inconnu';
    $ua = substr($_SERVER['HTTP_USER_AGENT'] ?? 'inconnu', 0, 200);
    $entry = sprintf("[%s] IP=%s UA=%s - %s\n",
        date('Y-m-d H:i:s'), $ip, $ua, $message);
    @file_put_contents(LOG_FILE, $entry, FILE_APPEND | LOCK_EX);
}

// ─── 1. Méthode HTTP ────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    reponse(false, 'Méthode non autorisée.', 405);
}

// ─── 2. Rate limiting par IP (anti-flood basique) ───────────
$ip = $_SERVER['REMOTE_ADDR'] ?? 'inconnu';
$ip_key = md5($ip);
$rate_dir = dirname(RATE_LIMIT_FILE);
if (!is_dir($rate_dir)) @mkdir($rate_dir, 0755, true);

$last_submissions = [];
if (file_exists(RATE_LIMIT_FILE)) {
    $last_submissions = @json_decode(@file_get_contents(RATE_LIMIT_FILE), true) ?: [];
}
$now = time();
// Nettoyer les entrées expirées (> 24h)
$last_submissions = array_filter($last_submissions, fn($ts) => ($now - $ts) < 86400);
if (isset($last_submissions[$ip_key]) && ($now - $last_submissions[$ip_key]) < RATE_LIMIT_SECONDS) {
    loguer('REFUS rate-limit');
    reponse(false, 'Trop de tentatives rapprochées. Veuillez patienter quelques secondes avant de réessayer.', 429);
}

// ─── 3. Honeypot anti-spam ──────────────────────────────────
if (!empty($_POST['website_url'])) {
    loguer('REFUS honeypot rempli (probable bot)');
    // On répond OK au bot pour ne pas l'alerter, mais on n'envoie rien
    reponse(true, 'Demande reçue.');
}

// ─── 4. Consentement RGPD obligatoire (Loi 2014-038) ───
if (!isset($_POST['consentement_donnees'])) {
    loguer('REFUS consentement RGPD manquant');
    reponse(false, 'Vous devez accepter le traitement de vos données pour soumettre la demande.', 400);
}

// ─── 5. Champs obligatoires ─────────────────────────────────
$nom        = nettoyer($_POST['nom'] ?? '');
$email      = nettoyer($_POST['email'] ?? '');
$telephone  = nettoyer($_POST['telephone'] ?? '');
$motif      = nettoyer($_POST['motif'] ?? '');
$ville      = nettoyer($_POST['ville'] ?? '');
$quartier   = nettoyer($_POST['quartier'] ?? '');

if ($nom === '' || $email === '' || $motif === '' || $ville === '' || $quartier === '') {
    loguer('REFUS champs obligatoires manquants');
    reponse(false, 'Tous les champs obligatoires doivent être renseignés.', 400);
}

// ─── 6. Validation email ────────────────────────────────────
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    loguer('REFUS email invalide : ' . substr($email, 0, 80));
    reponse(false, "L'adresse email saisie n'est pas valide.", 400);
}

// ─── 7. Champs facultatifs ──────────────────────────────────
$type_bien   = nettoyer($_POST['type_bien'] ?? '');
$pieces      = nettoyer($_POST['pieces'] ?? '');
$etages      = nettoyer($_POST['etages'] ?? '');
$superficie  = nettoyer($_POST['superficie'] ?? '');
$ville_autre = nettoyer($_POST['ville_autre'] ?? '');
$quartier_autre = nettoyer($_POST['quartier_autre'] ?? '');
$message     = nettoyer($_POST['message'] ?? '', MAX_MESSAGE_LENGTH);
// Langue du site depuis lequel la demande a été soumise (FR par défaut, "English" depuis /en/)
$langue_site = nettoyer($_POST['langue_site'] ?? 'Français');
if ($langue_site === '') { $langue_site = 'Français'; }

$commodites = [];
if (!empty($_POST['commodite_ascenseur']))        $commodites[] = 'Ascenseur';
if (!empty($_POST['commodite_balcon_terrasse']))  $commodites[] = 'Balcon / Terrasse';
if (!empty($_POST['commodite_jardin']))           $commodites[] = 'Jardin';
if (!empty($_POST['commodite_garage_parking']))   $commodites[] = 'Garage / Parking';

// Résolution ville/quartier "Autre"
$ville_finale = ($ville === 'Autre' && $ville_autre !== '') ? $ville_autre : $ville;
$quartier_finale = ($quartier === 'Autre' && $quartier_autre !== '') ? $quartier_autre : $quartier;

// ─── 8. Construction de l'email ─────────────────────────────
$sujet_email = sprintf('[Demande d\'expertise] — %s — %s', $motif, $nom);

$corps = <<<EMAIL
Bonjour,

Une nouvelle demande d'expertise a été soumise sur le site ExpertImmo.mg. Voici les détails :

--- IDENTIFICATION ---
Nom complet : {$nom}
Email : {$email}
Téléphone : {$telephone}
Langue du visiteur : {$langue_site}

--- MOTIF DE LA DEMANDE ---
Motif : {$motif}

--- CARACTÉRISTIQUES DU BIEN ---
Type de bien : {$type_bien}
Nombre de pièces : {$pieces}
Nombre d'étages : {$etages}
Superficie : {$superficie}
Commodités :
EMAIL;

$corps .= empty($commodites) ? 'Aucune précisée' : implode(', ', $commodites);

$corps .= "\n\n--- LOCALISATION ---\n";
$corps .= "Ville : {$ville_finale}\n";
$corps .= "Quartier : {$quartier_finale}\n";

$corps .= "\n--- PRÉCISIONS COMPLÉMENTAIRES ---\n";
$corps .= ($message !== '') ? $message : 'Aucune précision supplémentaire.';

$corps .= "\n\n--- CONFORMITÉ RGPD ---\n";
$corps .= "Consentement explicite : ACCEPTÉ (case obligatoire cochée)\n";
$corps .= "Référence légale : Loi n°2014-038 du 9 janvier 2015 (Madagascar)\n";

$corps .= "\n--- TRAÇABILITÉ ---\n";
$corps .= 'Date de soumission : ' . date('Y-m-d H:i:s') . " (heure Antananarivo)\n";
$corps .= 'Adresse IP de l\'expéditeur : ' . $ip . "\n";
$corps .= 'User-Agent : ' . substr($_SERVER['HTTP_USER_AGENT'] ?? 'inconnu', 0, 200) . "\n";
$corps .= "\n---------------------------------\n";
$corps .= "Email généré automatiquement par le formulaire d'ExpertImmo.mg\n";

// ─── 9. En-têtes de l'email (sécurisés) ────────────────────
$headers = [];
$headers[] = 'From: ' . EXPEDITEUR_NOM . ' <' . EXPEDITEUR_EMAIL . '>';
$headers[] = 'Reply-To: ' . $nom . ' <' . $email . '>';
$headers[] = 'X-Mailer: PHP/' . phpversion();
$headers[] = 'Content-Type: text/plain; charset=UTF-8';
$headers[] = 'Content-Transfer-Encoding: 8bit';

// ─── 10. Encodage UTF-8 du sujet (RFC 2047) ────────────────
$sujet_encode = '=?UTF-8?B?' . base64_encode($sujet_email) . '?=';

// ─── 11. Envoi de l'email ──────────────────────────────────
$envoi = @mail(
    DESTINATAIRE,
    $sujet_encode,
    $corps,
    implode("\r\n", $headers)
);

if (!$envoi) {
    loguer('ÉCHEC mail() pour ' . $email);
    reponse(false, "L'envoi a échoué. Vous pouvez nous contacter directement à " . DESTINATAIRE, 500);
}

// ─── 12. Succès : mise à jour rate-limit + log + réponse ───
$last_submissions[$ip_key] = $now;
@file_put_contents(RATE_LIMIT_FILE, json_encode($last_submissions), LOCK_EX);
loguer('SUCCÈS envoi : ' . $email . ' / motif=' . $motif);

reponse(true, 'Votre demande a bien été reçue. Le Cabinet vous recontactera sous 24h ouvrées.');
