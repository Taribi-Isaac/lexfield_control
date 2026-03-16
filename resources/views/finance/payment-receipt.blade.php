<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Receipt {{ $payment->receipt_number }}</title>
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
        .pill {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 999px;
            background: #eff6ff;
            color: #1e3a8a;
            font-size: 12px;
            font-weight: 600;
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
            <div class="pill">Receipt</div>
            <div><strong>{{ $payment->receipt_number }}</strong></div>
            <div class="badge">Paid</div>
            <div>Paid at: {{ optional($payment->paid_at)->format('Y-m-d') ?? '—' }}</div>
        </div>
    </div>

    <div class="section">
        <h2>Client Details</h2>
        <div><strong>{{ $payment->invoice?->client?->name }}</strong></div>
        <div>{{ $payment->invoice?->client?->email ?? '—' }}</div>
        <div>{{ $payment->invoice?->client?->phone ?? '—' }}</div>
        <div>{{ $payment->invoice?->client?->address ?? '—' }}</div>
        <div>Invoice: {{ $payment->invoice?->invoice_number ?? '—' }}</div>
    </div>

    <div class="section">
        <h2>Payment Summary</h2>
        <table>
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Reference</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Payment received</td>
                    <td>{{ number_format((float) $payment->amount, 2) }}</td>
                    <td>{{ $payment->method ?? '—' }}</td>
                    <td>{{ $payment->reference ?? '—' }}</td>
                </tr>
            </tbody>
        </table>
        <div class="totals">
            <div class="total"><strong>Total Paid: {{ number_format((float) $payment->amount, 2) }}</strong></div>
        </div>
    </div>

    <div class="footer">
        Received by {{ $payment->receivedBy?->name ?? '—' }} · Mon–Fri 9:00AM–5:00PM
    </div>
</body>
</html>
