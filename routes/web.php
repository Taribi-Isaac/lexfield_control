<?php

use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\CaseFileController;
use App\Http\Controllers\CauseListController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ConversationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\NotificationLetterController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\QuoteController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\StaffController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/login')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('staff', StaffController::class)->except(['show']);
    Route::resource('clients', ClientController::class);
    Route::resource('cases', CaseFileController::class);
    Route::resource('cause-list', CauseListController::class);
    Route::resource('reports', ReportController::class);
    Route::resource('quotes', QuoteController::class);
    Route::resource('invoices', InvoiceController::class);
    Route::resource('payments', PaymentController::class);
    Route::resource('messages', ConversationController::class)->only(['index', 'create', 'store', 'show']);
    Route::post('messages/{conversation}/send', [MessageController::class, 'store'])
        ->name('messages.send');
    Route::get('conversation-attachments/{attachment}/download', [\App\Http\Controllers\ConversationAttachmentController::class, 'download'])
        ->name('conversation-attachments.download');
    Route::get('activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs.index');
    Route::resource('notification-letters', NotificationLetterController::class)
        ->only(['index', 'create', 'store', 'show', 'edit', 'update']);
    Route::get(
        'notification-letters/{notification_letter}/download',
        [NotificationLetterController::class, 'download']
    )->name('notification-letters.download');
    Route::get('quotes/{quote}/download', [QuoteController::class, 'download'])
        ->name('quotes.download');
    Route::get('invoices/{invoice}/download', [InvoiceController::class, 'download'])
        ->name('invoices.download');
    Route::get('invoices/{invoice}/receipt', [InvoiceController::class, 'receipt'])
        ->name('invoices.receipt');
    Route::get('payments/{payment}/receipt', [PaymentController::class, 'receipt'])
        ->name('payments.receipt');
    Route::patch('reports/{report}/review', [ReportController::class, 'review'])->name('reports.review');
    Route::resource('roles', RoleController::class)->only(['index', 'edit', 'update']);
    Route::get('documents/{document}/download', [DocumentController::class, 'download'])
        ->name('documents.download');
    Route::resource('documents', DocumentController::class)->only(['index', 'create', 'store', 'show', 'destroy']);
});

require __DIR__.'/settings.php';
