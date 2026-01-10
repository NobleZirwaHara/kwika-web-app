<?php

use App\Http\Controllers\MessageController;
use App\Http\Controllers\Api\PushNotificationController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Use web middleware for session-based auth (compatible with Inertia)
Route::middleware(['web', 'auth'])->group(function () {
    // Messaging API routes
    Route::prefix('conversations')->name('conversations.')->group(function () {
        Route::get('/', [MessageController::class, 'getConversations'])->name('index');
        Route::post('/', [MessageController::class, 'getOrCreateConversation'])->name('create');
        Route::get('/{conversationId}/messages', [MessageController::class, 'getMessages'])->name('messages');
        Route::post('/{conversationId}/messages', [MessageController::class, 'sendMessage'])->name('send');
        Route::post('/{conversationId}/read', [MessageController::class, 'markAsRead'])->name('read');
        Route::post('/{conversationId}/upload', [MessageController::class, 'uploadFile'])->name('upload');
        Route::post('/{conversationId}/typing', [MessageController::class, 'typing'])->name('typing');
    });

    // Push Notification API routes
    Route::prefix('notifications')->name('notifications.')->group(function () {
        Route::post('/subscribe', [PushNotificationController::class, 'subscribe'])->name('subscribe');
        Route::post('/unsubscribe', [PushNotificationController::class, 'unsubscribe'])->name('unsubscribe');
        Route::post('/preferences', [PushNotificationController::class, 'updatePreferences'])->name('preferences');
        Route::get('/pending', [PushNotificationController::class, 'pending'])->name('pending');
        Route::post('/dismissed', [PushNotificationController::class, 'dismissed'])->name('dismissed');
        Route::post('/test', [PushNotificationController::class, 'test'])->name('test');
    });
});