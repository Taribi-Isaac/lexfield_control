<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $letter->title }}</title>
    <style>
        body {
            font-family: "Arial", sans-serif;
            color: #0f172a;
            background: #ffffff;
            margin: 0;
            padding: 32px;
        }
        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 2px solid #1e3a8a;
            padding-bottom: 18px;
            margin-bottom: 24px;
        }
        .brand {
            display: flex;
            gap: 14px;
            align-items: center;
        }
        .brand img {
            height: 44px;
            width: 44px;
        }
        .brand h1 {
            font-size: 22px;
            margin: 0;
        }
        .brand .subtitle {
            font-size: 12px;
            color: #475569;
        }
        .meta {
            text-align: right;
            font-size: 13px;
            color: #0f172a;
        }
        .section {
            margin-bottom: 24px;
        }
        .section h2 {
            font-size: 15px;
            margin-bottom: 8px;
            color: #1e3a8a;
        }
        .content {
            font-size: 14px;
            line-height: 1.7;
        }
        .footer {
            margin-top: 32px;
            font-size: 12px;
            color: #475569;
            border-top: 1px solid #e2e8f0;
            padding-top: 16px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="brand">
            <img src="{{ public_path('LEXFIELD-ICON.png') }}" alt="Lexfield Attorneys">
            <div>
                <h1>Lexfield Attorneys</h1>
                <div class="subtitle">10 Ada George Road, Port Harcourt, Rivers State, Nigeria</div>
                <div class="subtitle">+234-8032468300 | +234-9076781037 · info@lexfieldattorneys.com</div>
            </div>
        </div>
        <div class="meta">
            <div><strong>{{ $letter->title }}</strong></div>
            <div>Date: {{ $letter->created_at?->toDateString() }}</div>
        </div>
    </div>

    @if($letter->caseFile)
        <div class="section">
            <h2>Case Information</h2>
            <div class="content">
                <div><strong>Case:</strong> {{ $letter->caseFile?->case_title ?? '—' }}</div>
                <div><strong>Suit Number:</strong> {{ $letter->caseFile?->suit_number ?? '—' }}</div>
                <div><strong>Court:</strong> {{ $letter->caseFile?->court ?? '—' }}</div>
            </div>
        </div>
    @endif

    <div class="section">
        <h2>Notification</h2>
        <div class="content">{!! $letter->body !!}</div>
    </div>

    <div class="footer">
        For enquiries, visit www.lexfieldattorneys.com or send an email to
        info@lexfieldattorneys.com or call 08032468300
    </div>
</body>
</html>
