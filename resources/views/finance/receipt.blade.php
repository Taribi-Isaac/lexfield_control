<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Receipt {{ $invoice->invoice_number }}</title>
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
        .badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 999px;
            background: #dcfce7;
            color: #166534;
            font-size: 12px;
            font-weight: 600;
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
                <div class="subtitle">+234-8032468300 | +234-9076781037 · info@lexfieldsattorneys.com</div>
            </div>
        </div>
        <div class="meta">
            <div class="pill">Receipt</div>
            <div><strong>{{ $invoice->invoice_number }}</strong></div>
            <div>Title: {{ $invoice->title ?? '—' }}</div>
            <div class="badge">Paid</div>
            <div>Issued: {{ optional($invoice->issued_at)->format('Y-m-d') ?? '—' }}</div>
        </div>
    </div>

    <div class="section">
        <h2>Client Details</h2>
        <div><strong>{{ $invoice->client?->name }}</strong></div>
        <div>{{ $invoice->client?->email ?? '—' }}</div>
        <div>{{ $invoice->client?->phone ?? '—' }}</div>
        <div>{{ $invoice->client?->address ?? '—' }}</div>
        <div>Case: {{ $invoice->caseFile?->title ?? '—' }}</div>
    </div>

    <div class="section">
        <h2>Payment Summary</h2>
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
                @foreach ($invoice->items as $item)
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
            $taxAmount = (float) $invoice->subtotal * ((float) $invoice->tax / 100);
        @endphp
        <div class="totals">
            <div>Subtotal: {{ number_format((float) $invoice->subtotal, 2) }}</div>
            <div>Tax ({{ number_format((float) $invoice->tax, 2) }}%): {{ number_format($taxAmount, 2) }}</div>
            <div class="total"><strong>Total Paid: {{ number_format((float) $invoice->total, 2) }}</strong></div>
        </div>
    </div>

    <div class="footer">
        Received by Lexfield Attorneys · Mon–Fri 9:00AM–5:00PM
    </div>
</body>
</html>
