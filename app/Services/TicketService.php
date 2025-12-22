<?php

namespace App\Services;

use App\Models\EventTicket;
use App\Models\Seat;
use App\Models\User;
use chillerlan\QRCode\QRCode;
use chillerlan\QRCode\QROptions;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Carbon\Carbon;

class TicketService
{
    /**
     * Generate a unique ticket number.
     *
     * Format: TKT-{event_id}-{random}
     */
    public function generateTicketNumber(int $eventId): string
    {
        do {
            $ticketNumber = 'TKT-' . str_pad($eventId, 4, '0', STR_PAD_LEFT) . '-' . strtoupper(Str::random(8));
        } while (EventTicket::where('ticket_number', $ticketNumber)->exists());

        return $ticketNumber;
    }

    /**
     * Generate QR code for a ticket.
     *
     * Returns base64 encoded PNG image.
     */
    public function generateQRCode(EventTicket $ticket): string
    {
        $qrData = json_encode([
            'ticket_id' => $ticket->id,
            'ticket_number' => $ticket->ticket_number,
            'event_id' => $ticket->event_id,
            'signature' => $this->generateSignature($ticket),
        ]);

        $options = new QROptions([
            'outputType' => QRCode::OUTPUT_IMAGE_PNG,
            'eccLevel' => QRCode::ECC_H,
            'scale' => 10,
            'imageBase64' => true,
        ]);

        $qrcode = new QRCode($options);
        return $qrcode->render($qrData);
    }

    /**
     * Generate cryptographic signature for QR code validation.
     */
    private function generateSignature(EventTicket $ticket): string
    {
        $data = $ticket->id . $ticket->ticket_number . $ticket->event_id;
        return hash_hmac('sha256', $data, config('app.key'));
    }

    /**
     * Validate a QR code and return the ticket if valid.
     */
    public function validateTicket(string $qrCode): ?EventTicket
    {
        try {
            $qrData = json_decode($qrCode, true);

            if (!$qrData || !isset($qrData['ticket_id'], $qrData['signature'])) {
                return null;
            }

            $ticket = EventTicket::find($qrData['ticket_id']);

            if (!$ticket) {
                return null;
            }

            // Verify signature
            if ($qrData['signature'] !== $this->generateSignature($ticket)) {
                return null;
            }

            // Verify ticket number matches
            if ($qrData['ticket_number'] !== $ticket->ticket_number) {
                return null;
            }

            // Verify event ID matches
            if ($qrData['event_id'] !== $ticket->event_id) {
                return null;
            }

            return $ticket;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Generate PDF ticket.
     *
     * Returns path to generated PDF.
     */
    public function generateTicketPDF(EventTicket $ticket): string
    {
        $ticket->load(['event', 'ticketPackage', 'seat.section']);

        $pdf = Pdf::loadView('pdfs.ticket', [
            'ticket' => $ticket,
            'qrCode' => $ticket->qr_code,
        ]);

        $fileName = 'ticket-' . $ticket->ticket_number . '.pdf';
        $path = 'tickets/' . $ticket->order_id . '/' . $fileName;

        Storage::put($path, $pdf->output());

        return $path;
    }

    /**
     * Reserve seats for a specific duration.
     */
    public function reserveSeats(array $seatIds, int $minutes = 15): bool
    {
        try {
            $seats = Seat::whereIn('id', $seatIds)
                ->where('status', 'available')
                ->get();

            if ($seats->count() !== count($seatIds)) {
                return false; // Some seats are not available
            }

            foreach ($seats as $seat) {
                $seat->reserve($minutes);
            }

            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Release expired seat reservations.
     */
    public function releaseExpiredReservations(): void
    {
        Seat::where('status', 'reserved')
            ->where('reserved_until', '<', now())
            ->update([
                'status' => 'available',
                'reserved_until' => null,
            ]);
    }

    /**
     * Check in a ticket.
     */
    public function checkInTicket(EventTicket $ticket, User $checker): bool
    {
        if (!$ticket->isValid()) {
            return false;
        }

        if ($ticket->isCheckedIn()) {
            // Prevent double check-in (grace period: 30 seconds)
            if ($ticket->checked_in_at->diffInSeconds(now()) > 30) {
                return false;
            }
        }

        $ticket->update([
            'status' => 'used',
            'checked_in_at' => now(),
            'checked_in_by' => $checker->id,
        ]);

        // Increment event check-in count
        $ticket->event->incrementCheckIns();

        return true;
    }

    /**
     * Generate ticket with QR code for a new ticket.
     */
    public function createTicketWithQR(array $ticketData): EventTicket
    {
        // Generate ticket number
        $ticketData['ticket_number'] = $this->generateTicketNumber($ticketData['event_id']);

        // Create ticket (without QR initially)
        $ticketData['qr_code'] = '';
        $ticket = EventTicket::create($ticketData);

        // Generate and save QR code
        $qrCode = $this->generateQRCode($ticket);
        $ticket->update(['qr_code' => $qrCode]);

        return $ticket;
    }

    /**
     * Mark seats as sold for a ticket.
     */
    public function markSeatsAsSold(array $seatIds): void
    {
        Seat::whereIn('id', $seatIds)->update([
            'status' => 'sold',
            'reserved_until' => null,
        ]);
    }
}
