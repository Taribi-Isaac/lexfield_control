<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quote {{ $quote->quote_number }}</title>
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
            font-size: 16px;
            margin-bottom: 8px;
            color: #1e3a8a;
        }
        .pill {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 999px;
            background: #eff6ff;
            color: #1e3a8a;
            font-size: 12px;
            font-weight: 600;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
        }
        th, td {
            border-bottom: 1px solid #e2e8f0;
            padding: 10px 8px;
            text-align: left;
        }
        th {
            background: #eff6ff;
        }
        .totals {
            margin-top: 16px;
            text-align: right;
            font-size: 14px;
        }
        .totals .total {
            font-size: 16px;
            color: #0f172a;
        }
        .totals div {
            margin-bottom: 4px;
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
            <img style="width: 200px; height: auto; margin-bottom: 10px;" src="{{ public_path('LEXFIELD-LOGO.png') }}" alt="Lexfield Attorneys">
            <div>
                <!-- <h1>Lexfield Attorneys</h1> -->
                <div class="subtitle">10 Ada George Road, Port Harcourt, Rivers State, Nigeria</div>
                <div class="subtitle">+234-8032468300 | +234-9076781037 · info@lexfieldsattorneys.com</div>
            </div>
        </div>
        <div class="meta">
            <div class="pill">Quote</div>
            <div><strong>{{ $quote->quote_number }}</strong></div>
            <div><h4>{{ $quote->title ?? '—' }}</h4></div>
            <div>Status: {{ $quote->status }}</div>
            <div>Issued: {{ optional($quote->issued_at)->format('Y-m-d') ?? '—' }}</div>
            <div>Valid until: {{ optional($quote->valid_until)->format('Y-m-d') ?? '—' }}</div>
        </div>
    </div>

    <div class="section">
        <h2>Client Details</h2>
        <div><strong>{{ $quote->client?->name }}</strong></div>
        <div>{{ $quote->client?->email ?? '—' }}</div>
        <div>{{ $quote->client?->phone ?? '—' }}</div>
        <div>{{ $quote->client?->address ?? '—' }}</div>
        <div>Case: {{ $quote->caseFile?->title ?? '—' }}</div>
    </div>

    <div class="section">
        <h2>Quote Items</h2>
        <table>
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Line Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($quote->items as $item)
                    <tr>
                        <td>{{ $item->description }}</td>
                        <td>{{ $item->quantity }}</td>
                        <td>{{ number_format((float) $item->unit_price, 2) }}</td>
                        <td>{{ number_format((float) $item->line_total, 2) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
        @php
            $taxAmount = (float) $quote->subtotal * ((float) $quote->tax / 100);
        @endphp
        <div class="totals">
            <div>Subtotal: {{ number_format((float) $quote->subtotal, 2) }}</div>
            <div>Tax ({{ number_format((float) $quote->tax, 2) }}%): {{ number_format($taxAmount, 2) }}</div>
            <div class="total"><strong>Total: {{ number_format((float) $quote->total, 2) }}</strong></div>
        </div>
    </div>

    <div class="section">
        <h2>Notes</h2>
        <div>{{ $quote->notes ?? '—' }}</div>
    </div>

    <div class="footer">
        Prepared by {{ $quote->createdBy?->name ?? '—' }} · Mon–Fri 9:00AM–5:00PM
    </div>
</body>
</html>
