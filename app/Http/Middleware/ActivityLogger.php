<?php

namespace App\Http\Middleware;

use App\Models\ActivityLog;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ActivityLogger
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (! $request->user()) {
            return $response;
        }

        if (! in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE'], true)) {
            return $response;
        }

        $routeName = $request->route()?->getName();

        if ($routeName && str_starts_with($routeName, 'activity-logs.')) {
            return $response;
        }

        ActivityLog::query()->create([
            'user_id' => $request->user()->id,
            'action' => $request->method(),
            'route' => $routeName,
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'subject_type' => null,
            'subject_id' => null,
            'description' => $routeName ? "Performed {$routeName}" : 'Performed action',
            'metadata' => [
                'payload' => collect($request->except(['password', 'password_confirmation']))
                    ->map(function ($value) {
                        if ($value instanceof \Illuminate\Http\UploadedFile) {
                            return [
                                'name' => $value->getClientOriginalName(),
                                'size' => $value->getSize(),
                                'mime' => $value->getMimeType(),
                            ];
                        }

                        if (is_array($value)) {
                            return collect($value)->map(function ($item) {
                                if ($item instanceof \Illuminate\Http\UploadedFile) {
                                    return [
                                        'name' => $item->getClientOriginalName(),
                                        'size' => $item->getSize(),
                                        'mime' => $item->getMimeType(),
                                    ];
                                }

                                return $item;
                            })->all();
                        }

                        return $value;
                    })->all(),
            ],
        ]);

        return $response;
    }
}
