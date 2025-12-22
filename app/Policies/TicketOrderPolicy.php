<?php

namespace App\Policies;

use App\Models\TicketOrder;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TicketOrderPolicy
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
    public function view(User $user, TicketOrder $ticketOrder): bool
    {
        // Users can view their own orders
        if ($user->id === $ticketOrder->user_id) {
            return true;
        }

        // Admins can view all orders
        if ($user->is_admin) {
            return true;
        }

        // Providers can view orders for their events
        if ($user->is_provider && $ticketOrder->event->service_provider_id === $user->serviceProvider->id) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true; // All authenticated users can create orders
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, TicketOrder $ticketOrder): bool
    {
        // Only the order owner can update (cancel) their order
        return $user->id === $ticketOrder->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, TicketOrder $ticketOrder): bool
    {
        // Only admins can delete orders
        return $user->is_admin;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, TicketOrder $ticketOrder): bool
    {
        return $user->is_admin;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, TicketOrder $ticketOrder): bool
    {
        return $user->is_admin;
    }
}
