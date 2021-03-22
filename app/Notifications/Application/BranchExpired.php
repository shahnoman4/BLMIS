<?php

namespace App\Notifications\Application;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class BranchExpired extends Notification implements ShouldQueue
{
    use Queueable;


    protected $model;
    protected $via;
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(\App\Models\Branch $model, $via = ['database', 'mail'])
    {
        $this->model = $model;
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
        return (new MailMessage)
            ->subject('Application expired')
            ->line('Application # ' . $this->model->uid . ' has been expired');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($user)
    {
        $model = $this->model;
        return [
            'type' => 'branch_expired',
            'entity' => [
                'id' => $model->id,
                'service_type_id' => $model->service_type_id,
                'status_id' => $model->status_id,
            ],
        ];
    }
}
