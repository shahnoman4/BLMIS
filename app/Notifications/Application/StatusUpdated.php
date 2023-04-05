<?php

namespace App\Notifications\Application;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use App\Lookups\ApplicationStatus;

class StatusUpdated extends Notification implements ShouldQueue
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
        $msg = (new MailMessage)
                    ->subject('Application status updated')
                    ->line(trans('action.'. $this->data->type .'.'. $this->data->statuses->new));
        if($this->data->statuses->new == ApplicationStatus::COMMENTED){
            // $msg->line(c_decrypt($this->data->comments));
        }

        return $msg;
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($user)
    {
        $model = $this->data->model;
        return [
            'type' => 'status_update',
            'entity' => [
                'type' => $this->data->type,
                'id' => $model->id,
                'service_type_id' => $model->service_type_id,
                'status_id' => $this->data->statuses->new,
            ],
            'comments' => $this->data->statuses->new == ApplicationStatus::COMMENTED ? $this->data->comments : null
        ];
    }
}
