import React from 'react'
import {Notifications as CNotifications} from './Common'

export default class Notifications extends CNotifications{
    constructor(props){
        super(props);
        this.state = {
            busy: false,
            data: []
        };
    }
    render(){
        let data = _.filter(this.state.data, (item)=>{
            item.text = this.text(item.data);
            return !_.isEmpty(item.text);
        });
        let unreadItems = _.filter(data, (item)=>{
            return _.isEmpty(item.read_at);
        });
        return(
        <div className={this.props.theme == "admin" ? "col p3040" : "col"}>
            <div className="widget widget-content">
                <div className="widget-inner">
                    <div className="form-group">
                        <h3>Notifications</h3>
                    </div>
                    <div className="list-group notif-details">
                        {data.map((item, key)=>{
                            return(
                            <a key={key} className={"list-group-item list-group-item-action " + (item.read_at ? 'read' : 'un-read')} onClick={this.handleClick.bind(this, item)}>
                                <span className='notif-date'>{date.format(item.created_at, 'dddd MMMM, DD Y hh:mm A')}</span>
                                <span className='notif-msg'>{item.text}</span>
                            </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
        );
    }
}