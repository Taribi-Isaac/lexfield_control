<?php

use App\Http\Controllers\CaseFileController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\StaffController;
use Illuminate\Support\Facades\Route;
Route::redirect('/', '/login')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource('staff', StaffController::class)->except(['show']);
    Route::resource('clients', ClientController::class)->except(['show']);
    Route::resource('cases', CaseFileController::class)->except(['show']);
    Route::get('documents/{document}/download', [DocumentController::class, 'download'])
        ->name('documents.download');
    Route::resource('documents', DocumentController::class)->only(['index', 'create', 'store', 'destroy']);
});

require __DIR__.'/settings.php';
