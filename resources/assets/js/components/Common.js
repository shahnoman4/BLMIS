import React from 'react';
import InputMask from 'react-input-mask';
import DatePicker from "react-datepicker";
import api from '../config/app';
import { withRouter } from 'react-router-dom'

export const arrowStyle ={backgroundImage: "url('../public/media/arrowright.png')"};
export const submitStyle ={backgroundImage: "url('../public/media/submit.png')"};
export const backStyle ={backgroundImage: "url('../public/media/arrowback.png')"};

export default class Editable extends React.Component{
    constructor(props){
        super(props);
        this.watchInput = this.watchInput.bind(this);
    }
    watchInput(e){
        if(this.state.model){
            _.set(this.state.model, e.target.name, e.target.value);
            this.forceUpdate();
        }
        else{
            this.setState({[e.target.name]: e.target.value});
        }
    }
}
export const TargetContext = React.createContext({});
export const ThemeContext = React.createContext('public');
export const DataContext = React.createContext(null);

export class Validateable extends Editable{
    constructor(props, rules){
        super(props);
        this.validator = {
            rules,
            validate: ()=>{
                let isValid = true;
                this.validator.messages = {};
                for(let field in rules){
                    let asterisk = field.indexOf('*');
                    if(asterisk != -1){
                        let arr = field.substr(0, asterisk - 1);
                        let key = field.substr(asterisk + 2);
                        let __data = _.get(this.state.model, arr);
                        _.forEach(__data, (obj, idx)=>{
                            isValid = this.validator.validateField(field.replace('.*', '['+ idx +']')) && isValid;
                        });
                    }
                    else{
                        isValid = this.validator.validateField(field) && isValid;
                    }
                };
                if(!isValid){
                    console.log(this.validator.messages);
                    this.setState({errors: this.validator.messages});
                    setTimeout(()=>{
                        $('.is-invalid:first').focus();
                    }, 1);
                }
                return isValid;
            },
            validateField: (field)=>{
                _.set(this.validator.messages, field, []);
                let isValid = this.validator.runRule(field, rules[field.replace(/\[[0-9]+\]/, '.*')], _.get(this.validator.messages, field));
                if(isValid){
                    _.unset(this.validator.messages, field);
                }
                return isValid;
            },
            runRule: (field, rule, errs)=>{
                if(!rule) return true;
                let isValid = true;
                let value = _.get(this.state.model, field);
                if(rule.required_if){
                    if(!rule.required_if(this.state.model)){
                        return true;
                    }
                    rule.required = rule.message;
                }
                if(rule.required){
                    if(value == undefined || value == null || (_.isString(value) && !value.trim())){
                        errs.push(_.isString(rule.required) ? rule.required : (rule.messages || {}).required || field + " is required");
                        isValid = false;
                        return isValid;
                    }
                }
                if(rule.email){
                    let EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    isValid = EMAIL_REGEX.test(value);
                    if(!isValid){
                        errs.push(_.isString(rule.email) ? rule.email : (rule.messages || {}).required || field + " must be a valid email address");
                    }
                }
                if(rule.phone){
                    let PHONE_REGEX = /^(\+?\d{3}\s?\d{3}\s?\d{4})|(\+?\d{3}\s?\d{3}\s?\d{3}\s?\d{3}\s?\d{3})$/
                    isValid = PHONE_REGEX.test(value);
                    if(!isValid){
                        errs.push(_.isString(rule.phone) ? rule.phone : (rule.messages || {}).required || field + " must be a valid phone number");
                    }
                }
                if(rule.fax){
                    let FAX_REGEX = /^(\+?\d{3}\s?\d{3}\s?\d{4})|(\+?\d{3}\s?\d{3}\s?\d{3}\s?\d{3}\s?\d{3})$/
                    isValid = FAX_REGEX.test(value);
                    if(!isValid){
                        errs.push(_.isString(rule.fax) ? rule.fax : (rule.messages || {}).required || field + " must be a valid fax number");
                    }
                }
                if(rule.string){
                    let STRING_REGEX = /^[a-z0-9\s]+$/i
                    isValid = STRING_REGEX.test(value);
                    if(!isValid){
                        errs.push(_.isString(rule.string) ? rule.string : (rule.messages || {}).required || field + " must be alpha-numeric string");
                    }
                }
                if(rule.alpha_spaces){
                    let ALPHAS_REGEX = /^[a-z\s]+$/i
                    isValid = ALPHAS_REGEX.test(value);
                    if(!isValid){
                        errs.push(_.isString(rule.alpha_spaces) ? rule.alpha_spaces : (rule.messages || {}).required || " Only A-Z,a-z and space allowed");
                    }
                }
                if(rule.alpha_special_charaters){
                    let ALPHAS_REGEX = /^[ A-Za-z0-9@.&]*$/
                    isValid = ALPHAS_REGEX.test(value);
                    if(!isValid){
                        errs.push(_.isString(rule.alpha_special_charaters) ? rule.alpha_special_charaters : (rule.messages || {}).required || " Only A-Z,a-z and space allowed");
                    }
                }
                if(rule.numbers){
                    let NUMBERS_REGEX = /^[0-9]+$/i
                    isValid = NUMBERS_REGEX.test(value);
                    if(!isValid){
                        errs.push(_.isString(rule.numbers) ? rule.numbers : (rule.messages || {}).required || " Only numbers allowed");
                    }
                }
                
                //@TODO: extend validations for types
                // if(rule.date){
                
                // }
                // if(rule.url){
                
                // }
                return isValid;
            },
            hasError: (_field)=>{
                return _.has(this.messages, _field);
            },
            first: (_field)=>{
                let messages = this.validator.messages;
                for(let field in messages){
                    if(_field === field){                        
                        for(let rule in messages[field]){
                            return messages[field][rule];
                        }
                    }
                }
            },
            messages: {}
        };
    }
}

export class DropDown extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            selected: null,
            opened: false
        }
        this.select = this.select.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.wrapper = React.createRef();
        document.body.addEventListener("click", this.handleOutsideClick, false);
    }
    render(){
        return (
            <div className={"drop-down-list" + (this.state.opened ? " active" : "")} ref={this.wrapper}>
            <button className="btn btn-default" onClick={this.toggle.bind(this)}>{this.state.selected ? this.state.selected.text : (this.props.options.optionLabel || "Select")} <span className="caret">&#9662;</span></button>
            <ul className="drowp-down-menu">{this.renderOptions(this.props.options)}</ul>
            </div>
            );
        }
        renderOptions(options){
            let items = [<li key="0" className="drop-down-menu-item" onClick={this.select}>{options.optionLabel}</li>];
            let data = options.data;
            for(let i = 0; i < data.length; i++){
                items.push(<li key={i + 1} className="drop-down-menu-item" data-value={data[i].value} onClick={this.select}>{data[i].text}</li>);
            }
            return items;
        }
        select(e){
            let selected = _.find(this.props.options.data, {value: e.target.dataset.value});
            if(selected !== this.state.selected){
                this.setState({selected});
                this.props.onChange(selected);
            }
            e.stopPropagation();
            this.toggle();
            
        }
        toggle(){
            this.setState({opened: !this.state.opened});
        }
        handleOutsideClick(e){
            if(this.state.opened){
                if(!(this.wrapper.current.isSameNode(e.target) || this.wrapper.current.contains(e.target))){
                    this.toggle();
                }
            }
        }
    }
    
    
    export class ContextForm extends React.Component{
        render(){
            return(
                <TargetContext.Provider value={this.props.target}>
                {this.props.children}
                </TargetContext.Provider>
                );
            }
        }
        
        export class Input extends React.Component{
            constructor(props){
                super(props);
                this.element = React.createRef();
            }
            setValue(key, value){
                if(this.props.dataType == 'number' && value && _.isString(value)){
                    value = +value;
                }
                if(this.target && this.target.state){
                    _.set(this.target.state.model, key, value);
                    this.target.forceUpdate();
                }
                else{
                    this.setState(key, value);
                }
            }
            watchInput(e){
                _.unset(this.target.state, "errors." + this.props.name);
                this.setValue(this.props.name, e.target.value);
                this.props.onChange && this.props.onChange(e, this.props.name);
            }
            watchCheckbox(e){
                _.unset(this.target.state, "errors." + this.props.name);
                let thisValue = this.props.dataType == "number" ? +this.props.value : this.props.value;
                if(this.props.as == "checkList"){
                    let values = _.get(this.target.state.model, this.props.name, []);
                    if(e.target.checked) {
                        values = [...values, thisValue];
                    } else {
                        values = values.filter(v => v !== thisValue);
                    }
                    this.setValue(this.props.name, values);
                }
                else{
                    if(e.target.checked) {
                        this.setValue(this.props.name, this.props.value);
                    }
                    else{
                        this.setValue(this.props.name, null);
                    }
                }
                this.props.onChange && this.props.onChange(e, this.props.name);
            }
            watchFileInput(e){
                _.unset(this.target.state, "errors." + this.props.name);
                this.setValue(this.props.name, this.extractFiles(e.target));
                this.props.onChange && this.props.onChange(e);
            }
            watchDateInput(date){
                _.unset(this.target.state, "errors." + this.props.name);
                this.setValue(this.props.name, date);
                // this.setValue(this.props.name, date ? moment(date).format('MM/DD/YYYY') : '');
            }
            handleTempUpload(e){
                block(this.element.current.parentNode);
                let files = this.extractFiles(e.target);
                if(this.props.validate !== false){
                    let validated = this.validateFiles(files);
                    if(validated !== true){
                        this.setValue(this.props.name, null);
                        if(this.target && this.target.state){
                            _.set(this.target.state, "errors." + this.props.name, validated);
                            this.target.forceUpdate();
                        }
                        else{
                            this.setState({errors: {[this.props.name]: validated}});
                        }
                        unblock(this.element.current.parentNode);
                        e.preventDefault();
                        return;
                    }
                }
                api[this.props.as == 'tempUploadImage' ? 'uploadTempImage' : 'uploadTempFile'](files).then((res)=>{
                    this.element.current.value = "";
                    unblock(this.element.current.parentNode);
                    if(res.path){
                        console.log(this.target)
                         _.unset(this.target.state, "errors." + this.props.name);
                        this.setValue(this.props.name, res);
                        this.props.onUpload && this.props.onUpload(res);
                    }else {
                        console.log(res.errors,"result errorrr found");
                         this.setValue(this.props.name, null);
                        if(this.target && this.target.state){
                            _.set(this.target.state, "errors." + this.props.name, res.errors &&  res.errors.temp || ["Please upload a valid pdf"]);
                            this.target.forceUpdate();
                        }
                        else{
                            this.setState({errors: {[this.props.name]: res.errors &&  res.errors.temp || ["Please upload a valid pdf"]}});
                        }
                    }
                    // else{
                    //     _.unset(this.target.state, "errors." + this.props.name);
                    //     this.setValue(this.props.name, res);
                    //     this.props.onUpload && this.props.onUpload(res);
                    // }
                });
            }
            validateFiles(files){
                if(!_.isArray(files)){
                    files = [files];
                }
                let err = [];
                let allowedTypes = this.props.allowedTypes || ['pdf'];
                if(this.props.as == "tempUploadImage"){
                    allowedTypes = this.props.allowedTypes || ['png', 'jpg', 'jpeg'];
                }
                let maxSize = this.props.maxSize || 10000;
                _.forEach(files, (file)=>{
                    let ext = (file.name.split('.').pop() || "").toLowerCase();
                    if(_.indexOf(allowedTypes, ext) === -1){
                        err.push('The file must be of type: '+ allowedTypes.join(', ') +'.');
                    }
                    if(file.size/1024 > maxSize){
                        err.push('File may not be greater than '+ maxSize +' kilobytes.');
                    }
                });
                return _.isEmpty(err) ? true : err;
            }
            extractFiles(input){
                let files = [];
                _.forEach(input.files, file => {
                    files.push(file)
                });
                if(this.props.multiple){
                    return files;
                }
                return files[0];
            }
            watchAllowedChars(e){
                let allowed;
                if(this.props.as == "phoneNumber"){
                    allowed = '0123456789#+ ';
                }
                if(allowed){
                    if(allowed.indexOf(e.key) === -1){
                        e.preventDefault();
                        return false;
                    }
                }
            }
            render(){
                let {name, as, className, lookup, lookupDrop, filterBy, data, dataType, onChange, onUpload, eref, mask, dateFormat, ...rest} = this.props;
                let errTemplate;
                if(as == "phoneNumber"){
                    rest.onKeyPress = this.watchAllowedChars.bind(this);
                }
                if(!rest.autoComplete){
                    rest.autoComplete = "off";
                }
                return(
                    <TargetContext.Consumer>
                    {(target)=>{
                        if(target && target.onPressEnter){
                            rest.onKeyPress = function(e){
                                if(e.nativeEvent.which === 13){
                                    target.onPressEnter();
                                }
                            }
                        }
                        if(target && target instanceof Validateable && target.validateOnBlur && this.props.type != "file"){
                            rest.onBlur = function(e){
                                let __errors = target.state.errors || {};
                                if(target.validator.validateField(name)){
                                    _.unset(__errors, name);
                                }
                                else{
                                    _.set(__errors, name, _.get(target.validator.messages, name));
                                }
                                target.setState({errors: __errors});
                            }
                        }
                        if(eref){
                            rest.ref = eref;
                        }
                        this.target = target;
                        if(_.has(target.state.errors, name)){
                            className = (className ? className + " " : "") + "is-invalid";
                            errTemplate = <div className="invalid-feedback">{_.get(target.state.errors, name + ".0", '')}</div>;
                        }
                        if(!rest){
                            rest = {};
                        }
                        rest.className = className;
                        if(as == "select"){
                            if(!data && lookup){
                                data = (__app.LOOKUP.get(lookup) || {}).data || [];
                                if(lookupDrop){
                                    data = _.filter(data, function(item){
                                        return lookupDrop.indexOf(item.value) == -1;
                                    });
                                }
                                
                                if(typeof filterBy == "function"){
                                    data = filterBy(data);
                                }else{
                                    data = _.filter(data, filterBy) || [];
                                }
                            }
                            return(
                                <React.Fragment>
                                <select ref={this.element}
                                value={_.get(target.state.model, this.props.name, '')}
                                onChange={this.watchInput.bind(this)}
                                {...rest}
                                >
                                {this.props.children}
                                {data ? data.map((item, key)=>{
                                    return <option key={key} value={item.value}>{item.text}</option>
                                }) : null}
                                </select>
                                {errTemplate}
                                </React.Fragment>
                                );
                            }
                            if(as == "textarea"){
                                return(
                                    <React.Fragment>
                                    <textarea
                                    value={_.get(target.state.model, this.props.name) || ''}
                                    onChange={this.watchInput.bind(this)}
                                    {...rest}
                                    />
                                    {errTemplate}
                                    </React.Fragment>
                                    )
                                }
                                if(as == "datepicker"){
                                    
                                    let strDate = _.get(target.state.model, this.props.name);
                                    let selected;
                                    if(_.isDate(strDate)){
                                        selected = strDate;
                                    }
                                    else if(strDate){
                                        let date = moment(strDate, ['MM/DD/YYYY', 'YYYY-MM-DD']);
                                        if(date.isValid()){
                                            selected = date.toDate();
                                        }
                                    }
                                    if(mask){
                                        return (
                                            <InputMask
                                            mask={mask} maskChar={null}
                                            value={_.get(target.state.model, this.props.name) || ''}
                                            onChange={this.watchDateInput.bind(this)}
                                            {...rest} children={()=>{
                                                // return <input type='text' />
                                                return(
                                                    <DatePicker
                                                    selected={selected ? selected : undefined}
                                                    placeholderText={rest.placeholder}
                                                    dateFormat={dateFormat}
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    onChange={null}
                                                    onFocus={null}
                                                    onBlur={null}
                                                    disabled={null}
                                                    readOnly={null}
                                                    // onKeyDown={null}
                                                    disabledKeyboardNavigation
                                                    // onChange={this.watchDateInput.bind(this)}
                                                    {...rest}
                                                    />
                                                    );
                                                }} />
                                                );
                                                
                                            }
                                            return(
                                                <React.Fragment>
                                                <DatePicker
                                                selected={selected ? selected : undefined}
                                                placeholderText={rest.placeholder}
                                                showMonthDropdown
                                                showYearDropdown
                                                onChange={this.watchDateInput.bind(this)}
                                                {...rest}
                                                />
                                                {errTemplate}
                                                </React.Fragment>
                                                )
                                            }
                                            if(this.props.type == "file"){
                                                if(as == "tempUpload" || as == "tempUploadImage"){
                                                    return (
                                                        <React.Fragment>
                                                        <input ref={this.element}
                                                        onChange={this.handleTempUpload.bind(this)}
                                                        {...rest}
                                                        />
                                                        {errTemplate}
                                                        </React.Fragment>
                                                        );
                                                    }
                                                    
                                                    return (
                                                        <React.Fragment>
                                                        <input ref={this.element}
                                                        onChange={this.watchFileInput.bind(this)}
                                                        {...rest}
                                                        />
                                                        {errTemplate}
                                                        </React.Fragment>
                                                        );
                                                    }
                                                    if(this.props.type == "checkbox"){
                                                        return(
                                                            <React.Fragment>
                                                            <input
                                                            checked={(()=>{
                                                                if(as == "checkList"){
                                                                    return _.get(this.target.state.model, this.props.name, []).includes(dataType == "number" ? +this.props.value : this.props.value);
                                                                }
                                                                else{
                                                                    return _.get(this.target.state.model, this.props.name) == this.props.value;
                                                                }
                                                            })()}
                                                            onChange={this.watchCheckbox.bind(this)}
                                                            {...rest}
                                                            />
                                                            {errTemplate}
                                                            </React.Fragment>
                                                            )
                                                        }
                                                        if(mask){
                                                            return (
                                                                
                                                                <React.Fragment>
                                                                <InputMask
                                                                mask={mask} maskChar={null}
                                                                value={_.get(target.state.model, this.props.name) || ''}
                                                                onChange={this.watchInput.bind(this)}
                                                                {...rest}
                                                                />
                                                                {errTemplate}
                                                                </React.Fragment>
                                                                );
                                                                
                                                            }
                                                            return (
                                                                
                                                                <React.Fragment>
                                                                <input ref={this.element}
                                                                value={_.get(target.state.model, this.props.name) || ''}
                                                                onChange={this.watchInput.bind(this)}
                                                                {...rest}
                                                                />
                                                                {errTemplate}
                                                                </React.Fragment>
                                                                );
                                                                
                                                            }}
                                                            </TargetContext.Consumer>
                                                            );
                                                        }
                                                    }
                                                    
                                                    export function Blank(){
                                                        return null;
                                                    }
                                                    
                                                    class __Redirect extends React.Component{
                                                        componentDidMount(){
                                                            this.props.history.push(this.props.to || "/");
                                                        }
                                                        render(){
                                                            return <Blank />;
                                                        }
                                                    }
                                                    export const Redirect = withRouter(__Redirect);
                                                    
                                                    export class Notifications extends React.Component{
                                                        constructor(props){
                                                            super(props);
                                                            this.state = {
                                                                data: []
                                                            };
                                                            if(this.props.watch !== false){
                                                                this.intervalId = setInterval(()=>{
                                                                    (!document.hasFocus || document.hasFocus()) && this.renderData();
                                                                }, 30 * 1000); // refresh every 30 seconds
                                                                window.addEventListener('focus', ()=>{
                                                                    this.renderData();
                                                                }, false);
                                                            }
                                                        }
                                                        componentWillUnmount(){
                                                            clearInterval(this.intervalId);
                                                        }
                                                        componentDidMount(){
                                                            this.renderData();
                                                        }
                                                        renderData(){
                                                            this.fetchData().then((data)=>{
                                                                this.setState({data});
                                                            });
                                                        }
                                                        fetchData(){
                                                            return api.get('/notification' + (this.props.watch === false ? '?all=true' : ''));
                                                        }
                                                        text(data){
                                                            switch(data.type){
                                                                case 'status_update':
                                                                    return lang('action.' + data.entity.type + '.' + data.entity.status_id);
                                                                case 'branch_application':
                                                                    if(isBranch(data.entity)){
                                                                        return 'Application submitted for branch office permission'
                                                                    }
                                                                    else if(isSubBranch(data.entity)){
                                                                        return 'Application submitted for sub branch office permission'
                                                                    }
                                                                    else if(isLiaison(data.entity)){
                                                                        return 'Application submitted for liaison office permission'
                                                                    }
                                                                    else if(isSubLiaison(data.entity)){
                                                                        return 'Application submitted for sub liaison office permission'
                                                                    }
                                                                case 'contract_added':
                                                                    return 'Contract added'
                                                                case 'signup':
                                                                    return lang('action.signup.' + data.entity.status_id);
                                                                case 'branch_expiring':
                                                                    if(isBranch(data.entity)){
                                                                        return 'Application for branch office permission is near to expire'
                                                                    }
                                                                    else if(isSubBranch(data.entity)){
                                                                        return 'Application for sub branch office permission is near to expire'
                                                                    }
                                                                    else if(isLiaison(data.entity)){
                                                                        return 'Application for liaison office permission is near to expire'
                                                                    }
                                                                    else if(isSubLiaison(data.entity)){
                                                                        return 'Application for sub liaison office permission is near to expire'
                                                                    }
                                                                case 'branch_expired':
                                                                    if(isBranch(data.entity)){
                                                                        return 'Application for branch office permission has been expired'
                                                                    }
                                                                    else if(isSubBranch(data.entity)){
                                                                        return 'Application for sub branch office permission has been expired'
                                                                    }
                                                                    else if(isLiaison(data.entity)){
                                                                        return 'Application for liaison office permission has been expired'
                                                                    }
                                                                    else if(isSubLiaison(data.entity)){
                                                                        return 'Application for sub liaison office permission has been expired'
                                                                    }
                                                            }
                                                        }
                                                        handleClick(item){
                                                            if(!item.read_at){
                                                                this.markAsRead(item);
                                                            }
                                                            if(__app._theme == "admin"){
                                                                let data = item.data;
                                                                switch(data.type){
                                                                    case 'status_update':
                                                                        this.props.history.push("/application/"+ data.entity.type +"/all/" + data.entity.id);
                                                                    break;
                                                                    case 'branch_application':
                                                                    case 'branch_expiring':
                                                                    case 'branch_expired':
                                                                        if(isBranch(data.entity) || isSubBranch(data.entity)){
                                                                            this.props.history.push("/application/branch/all/" + data.entity.id);
                                                                        }
                                                                        else if(isLiaison(data.entity) || isSubLiaison(data.entity)){
                                                                            this.props.history.push("/application/liaison/all/" + data.entity.id);
                                                                        }
                                                                    break;
                                                                    case 'contract_added':
                                                                        this.props.history.push("/application/contract/" + data.entity.id);
                                                                    break;
                                                                    case 'signup':
                                                                        this.props.history.push("/application/signup/all/" + data.entity.id);
                                                                    break;
                                                                }
                                                            }
                                                        }
                                                        markAsRead(item){
                                                            api.put('/notification/' + item.id).then((res)=>{
                                                                if(res.success){
                                                                    item.read_at = res.data.read_at;
                                                                }
                                                            });
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
                                                                <div className={"dropdown widget widget-notif" + (unreadItems.length ? " has-unread" : "")}>
                                                                <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">
                                                                <i className="fas fa-bell"></i>
                                                                </button>
                                                                <ul className="dropdown-menu dropdown-menu-right">
                                                                <li className="dropdown-header">Notifications</li>
                                                                {!data.length ? <li><a>No new notifications</a></li> : null}
                                                                {data.map((item, key)=>{
                                                                    return(
                                                                        <li key={key} className={'-notification-item ' + (item.read_at ? 'read' : 'un-read')} onClick={this.handleClick.bind(this, item)}>
                                                                        <a>
                                                                        <span className='notif-date'>{date.format(item.created_at, 'MM/DD/YYYY')}</span>
                                                                        <span className='notif-msg'>{item.text}</span>
                                                                        {item.data.comments ? <div className='notif-comments'>{item.data.comments}</div> : ''}
                                                                        </a>
                                                                        </li>
                                                                        );
                                                                    })}
                                                                    <li className="dropdown-footer -notification-item">
                                                                    <a onClick={()=>{this.props.history.push('/notification')}}>
                                                                    <span>View all</span>
                                                                    </a>
                                                                    </li>
                                                                    </ul>
                                                                    </div>
                                                                    );
                                                                }
                                                            }
                                                            
                                                            export class TextSearch extends React.Component{
                                                                startWatch(){
                                                                    this.reservedAt = parseInt((new Date).getTime() / 1000);
                                                                }
                                                                watch(e){
                                                                    let query = e.target.value.trim();
                                                                    let waitOffset = 1; //wait n seconds while typing
                                                                    clearTimeout(this.timerId);
                                                                    let now = parseInt((new Date).getTime() / 1000);
                                                                    if(this.reservedAt < now - waitOffset){
                                                                        this.submit(query);
                                                                    }
                                                                    else{
                                                                        this.timerId = setTimeout(()=>{
                                                                            clearTimeout(this.timerId);
                                                                            this.submit(query);
                                                                        }, (waitOffset - (now - this.reservedAt)) * 1000);
                                                                    }
                                                                }
                                                                submit(query){
                                                                    if(query != this.__lastQuery){
                                                                        this.__lastQuery = query;
                                                                        this.props.onSearch && this.props.onSearch(query);
                                                                    }
                                                                }
                                                                render(){
                                                                    let {onSearch, ...attrs} = this.props;
                                                                    return <input type="text" {...attrs} onPaste={(e)=>{let t = e.target; setTimeout(()=>{this.submit(t.value.trim())}, 0)}} onKeyDown={this.startWatch.bind(this)} onKeyUp={this.watch.bind(this)} />
                                                                }
                                                            }