<?php

namespace App\Notifications\Application;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class ContractAdded extends Notification implements ShouldQueue
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
        $first3 = substr($this->data->model->uid, 0, 3);
        $last3 = substr($this->data->model->uid,  -3);
        $uid = $first3.$last3;
        return (new MailMessage)->subject('New contract added')->view('emails.contract', ["user" => $user, "id" => $uid]);    
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
            'type' => 'contract_added',
            'entity' => [
                'branch_id' => $model->branch->id,
                'service_type_id' => $model->branch->service_type_id,
                'id' => $model->id,
                'status_id' => $model->status_id,
            ],
        ];
    }
}
