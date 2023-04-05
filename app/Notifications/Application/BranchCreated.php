<?php

namespace App\Notifications\Application;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class BranchCreated extends Notification implements ShouldQueue
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
        if(\is_branch($this->data->model)){
             $text = 'Application submitted for branch office permission.';
        }
        else if(\is_sub_branch($this->data->model)){

            $text = 'Application submitted for sub branch office permission.';
        }
        else if(\is_liaison($this->data->model)){
            $text = 'Application submitted for liaison office permission.';
        }
        else if(\is_sub_liaison($this->data->model)){
            $text = 'Application submitted for sub liaison office permission.';
           
        }

        $first3 = substr($this->data->model->uid, 0, 3);
        $last3 = substr($this->data->model->uid,  -3);
        $uid = $first3.$last3;
        return (new MailMessage)
            ->subject($text)
            ->view('emails.branchCreated', ["id" => $uid]);
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
            'type' => 'branch_application',
            'entity' => [
                'service_type_id' => $model->service_type_id,
                'id' => $model->id,
                'status_id' => $model->status_id,
            ],
        ];
    }
}
