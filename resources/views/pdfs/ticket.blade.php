<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ticket - {{ $ticket->ticket_number }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            background: #f5f5f5;
            padding: 20px;
        }

        .ticket-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .ticket-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .ticket-header h1 {
            font-size: 28px;
            margin-bottom: 8px;
            font-weight: bold;
        }

        .ticket-header .event-title {
            font-size: 20px;
            opacity: 0.95;
        }

        .ticket-body {
            padding: 30px;
        }

        .qr-section {
            text-align: center;
            padding: 30px 0;
            border-bottom: 2px dashed #e0e0e0;
        }

        .qr-code {
            width: 250px;
            height: 250px;
            margin: 0 auto;
            border: 3px solid #667eea;
            border-radius: 8px;
            padding: 10px;
            background: white;
        }

        .qr-code img {
            width: 100%;
            height: 100%;
        }

        .ticket-number {
            margin-top: 15px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            color: #666;
            letter-spacing: 1px;
        }

        .info-section {
            padding: 30px 0;
        }

        .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
        }

        .info-item {
            margin-bottom: 15px;
        }

        .info-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
        }

        .info-value {
            font-size: 16px;
            color: #333;
            font-weight: 600;
        }

        .full-width {
            grid-column: span 2;
        }

        .attendee-section {
            background: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
        }

        .package-badge {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            margin-top: 10px;
        }

        .ticket-footer {
            background: #f9f9f9;
            padding: 25px 30px;
            border-top: 2px dashed #e0e0e0;
            text-align: center;
        }

        .footer-text {
            font-size: 12px;
            color: #666;
            line-height: 1.6;
        }

        .important-notice {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }

        .important-notice p {
            font-size: 13px;
            color: #856404;
            margin: 5px 0;
        }

        .logo {
            width: 120px;
            margin-bottom: 15px;
        }

        @media print {
            body {
                background: white;
                padding: 0;
            }

            .ticket-container {
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    <div class="ticket-container">
        <!-- Header -->
        <div class="ticket-header">
            @if(file_exists(public_path('kwika-logo.png')))
                <img src="{{ public_path('kwika-logo.png') }}" alt="Logo" class="logo">
            @endif
            <h1>EVENT TICKET</h1>
            <div class="event-title">{{ $ticket->event->title }}</div>
        </div>

        <!-- Body -->
        <div class="ticket-body">
            <!-- QR Code Section -->
            <div class="qr-section">
                <div class="qr-code">
                    <img src="{{ $qrCode }}" alt="Ticket QR Code">
                </div>
                <div class="ticket-number">
                    Ticket #{{ $ticket->ticket_number }}
                </div>
            </div>

            <!-- Event Information -->
            <div class="info-section">
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Date</div>
                        <div class="info-value">
                            {{ \Carbon\Carbon::parse($ticket->event->start_datetime)->format('l, F j, Y') }}
                        </div>
                    </div>

                    <div class="info-item">
                        <div class="info-label">Time</div>
                        <div class="info-value">
                            {{ \Carbon\Carbon::parse($ticket->event->start_datetime)->format('g:i A') }}
                        </div>
                    </div>

                    <div class="info-item full-width">
                        <div class="info-label">Venue</div>
                        <div class="info-value">{{ $ticket->event->venue_name }}</div>
                        <div style="font-size: 14px; color: #666; margin-top: 5px;">
                            {{ $ticket->event->venue_address }}, {{ $ticket->event->venue_city }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Attendee Information -->
            <div class="attendee-section">
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Ticket Holder</div>
                        <div class="info-value">{{ $ticket->attendee_name }}</div>
                    </div>

                    <div class="info-item">
                        <div class="info-label">Email</div>
                        <div class="info-value" style="font-size: 14px;">{{ $ticket->attendee_email }}</div>
                    </div>

                    @if($ticket->seat)
                    <div class="info-item">
                        <div class="info-label">Seat</div>
                        <div class="info-value">
                            {{ $ticket->seat->section->name }} - {{ $ticket->seat->seat_number }}
                        </div>
                    </div>
                    @endif

                    <div class="info-item">
                        <div class="info-label">Ticket Type</div>
                        <div class="package-badge">{{ $ticket->ticketPackage->name }}</div>
                    </div>
                </div>
            </div>

            <!-- Important Notice -->
            <div class="important-notice">
                <p><strong>IMPORTANT:</strong></p>
                <p>• Please bring this ticket (printed or on your mobile device) to the event</p>
                <p>• Show the QR code at the entrance for check-in</p>
                <p>• Each ticket is valid for one-time entry only</p>
                <p>• Ticket is non-transferable and non-refundable</p>
            </div>
        </div>

        <!-- Footer -->
        <div class="ticket-footer">
            <div class="footer-text">
                <p><strong>Kwika Events</strong></p>
                <p>For support, contact us at support@kwika.events</p>
                <p style="margin-top: 10px; font-size: 11px;">
                    Issued: {{ \Carbon\Carbon::now()->format('F j, Y g:i A') }}
                </p>
            </div>
        </div>
    </div>
</body>
</html>
