<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class TwoFAPinIssued extends Notification implements ShouldQueue
{
    use Queueable;


    protected $data;
    protected $via;
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($data, $via = ['mail'])
    {
        $this->data = $data;
        $this->via = $via;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($user)
    {
        return $this->via;
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($user)
    {
        $user = $this->data->user;

        return (new MailMessage)->subject('Verfication PIN')->view('emails.twofapin', ["user" => $user, "emailPin" => $this->data->emailPin]);
    }
}
