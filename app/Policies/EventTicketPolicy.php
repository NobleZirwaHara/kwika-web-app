<?php

namespace App\Policies;

use App\Models\EventTicket;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class EventTicketPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, EventTicket $eventTicket): bool
    {
        // Users can view their own tickets
        if ($user->id === $eventTicket->user_id) {
            return true;
        }

        // Admins can view all tickets
        if ($user->is_admin) {
            return true;
        }

        // Providers can view tickets for their events
        if ($user->is_provider && $eventTicket->event->service_provider_id === $user->serviceProvider->id) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true; // Created through orders
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, EventTicket $eventTicket): bool
    {
        // Only admins and providers can update tickets (for check-in)
        if ($user->is_admin) {
            return true;
        }

        if ($user->is_provider && $eventTicket->event->service_provider_id === $user->serviceProvider->id) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, EventTicket $eventTicket): bool
    {
        // Only admins can delete tickets
        return $user->is_admin;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, EventTicket $eventTicket): bool
    {
        return $user->is_admin;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, EventTicket $eventTicket): bool
    {
        return $user->is_admin;
    }
}
