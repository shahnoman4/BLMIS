<?php

namespace App\Notifications\Application;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use App\Lookups\ApplicationStatus;
use App\Mail\CompanyRegistrationMail as RegMail;

class CompanyRegistered extends Notification implements ShouldQueue
{
    use Queueable;


    protected $data;
    protected $via;
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($data, $via = ['database', 'mail'])
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
        // if($user->isSuperAdmin()){
        //     return ['database', 'mail'];
        // }
        // return ['mail'];

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
        return (new MailMessage)->view('auth.emails.new-company', ["user" => $user, "password" => $this->data->password]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($user)
    {
        return [
            'type' => 'signup',
            'entity' => [
                'id' => $this->data->user->company->id,
                'status_id' => $this->data->user->company->status_id,
            ]
        ];
    }
}
