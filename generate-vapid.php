<?php

require_once __DIR__ . '/vendor/autoload.php';

use Minishlink\WebPush\VAPID;

// Generate VAPID keys
$keys = VAPID::createVapidKeys();

echo "VAPID Keys Generated Successfully!\n";
echo "================================\n\n";
echo "Add these to your .env file:\n\n";
echo "VAPID_PUBLIC_KEY=" . $keys['publicKey'] . "\n";
echo "VAPID_PRIVATE_KEY=" . $keys['privateKey'] . "\n\n";
echo "The public key should be used in your frontend JavaScript.\n";