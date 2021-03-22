let ServiceType = __app.LOOKUP.ServiceType;
export function block(elem, msg){
    elem.classList.add("busy");
    let msgAttr = document.createAttribute("busy-msg");
    msgAttr.value = msg || "Processing...";
    elem.attributes.setNamedItem(msgAttr);
}

export function unblock(elem){
    elem.classList.remove("busy");
    try{
        elem.attributes.removeNamedItem("busy-msg");
    }
    catch(e){
        
    }
}

export function applicationStatusName(statusId, attempts){
    let ApplicationStatus = __app.LOOKUP.ApplicationStatus;
    switch(+statusId){
        case ApplicationStatus.NEW: case ApplicationStatus.REVERTED: case ApplicationStatus.HELD: return 'new';
        case ApplicationStatus.SUBMITTED: return 'new';
        case ApplicationStatus.PENDING: return 'new';
        case ApplicationStatus.CIRCULATED: return 'circulated';
        case ApplicationStatus.APPROVED: return 'approved';
        case ApplicationStatus.REJECTED:
            if(attempts >= 2){
                return 'rejected';
            }
            else{
                return 'reviewable';
            }
    }
    return '';
}

export function asset(path){
    return __app.baseURL + "/" + path;
}

export function lang(path, locale){
    if(!locale) locale = "en";
    return _.get(__app.lang, locale + "." + path, path);
}

export function url(uri){
    return __app.baseURL + (_.startsWith(uri, '/') ? "" : "/") + uri;
}

export const date = {
    format: function(strDate, format){
        return moment.utc(strDate).local().format(format || 'MMM, DD Y')
    }
}

export function strBool(val){
    return val == 1 ? 'Yes' : 'No';
}

export function years(startOffset, noOfYears){
    if(startOffset === undefined){
        startOffset = -5;
    }
    if(noOfYears === undefined){
        noOfYears = 15;
    }

    let data = [];
    let start = moment().year() + startOffset;
    for(let i = 0; i < noOfYears; i++){
        data.push({text: start + i, value: start + i});
    }

    return data;
}

export function isMainBranch(model){
    return model.service_type_id == ServiceType.BRANCH || model.service_type_id == ServiceType.LIAISON;
}

export function isBranchType(model){
    return isBranch(model) || isSubBranch(model);
}

export function isBranch(model){
    return model.service_type_id == ServiceType.BRANCH;
}

export function isSubBranch(model, orIsSubLiaison){
    return model.service_type_id == ServiceType.SUB_BRANCH || (orIsSubLiaison && isSubLiaison(model));
}

export function isLiaisonType(model){
    return isLiaison(model) || isSubLiaison(model);
}

export function isLiaison(model){
    return model.service_type_id == ServiceType.LIAISON;
}

export function isSubLiaison(model, orIsSubBranch){
    return model.service_type_id == ServiceType.SUB_LIAISON || (orIsSubBranch && isSubBranch(model));
}

export function months(){
    return __app.LOOKUP.Month.data;
}

export const notify = {
    success: (msg, title, duration) => (__app.__c.notify(msg, 'success', title, duration)),
    error: (msg, title, duration) => (__app.__c.notify(msg, 'danger', title, duration)),
    info: (msg, title, duration) => (__app.__c.notify(msg, 'info', title, duration)),
    warn: (msg, title, duration) => (__app.__c.notify(msg, 'warning', title, duration)),
};

export function stringifyDates(data, format, fieldsFormat){
	format = format || "YYYY-MM-DD HH:mm:ss";
	if(data instanceof Date){
		return moment(data).format(format);
	}
	if(_.isArray(data) || _.isPlainObject(data)){
		_.forEach(data, function(date, i){
			data[i] = stringifyDates(date, format, fieldsFormat);
		});
	}
	return data;
}

export function openWindowWithPost(url, _data, target) {
    let data = _.cloneDeep(_data) || {};
    let token = document.head.querySelector('meta[name="csrf-token"]');
    if(token){
        data['_token'] = token.content;
    }
    let form = document.createElement("form");
    form.target = target || "_blank";
    form.method = "POST";
    form.action = url;
    form.style.display = "none";
    appendFieldsToForm(form, data);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}


function appendFieldsToForm(form, fields, initial /* optional */) {
	let f, i, len;
	for (f in fields) {
		if (fields[f]instanceof Array) {
			len = fields[f].length;
			for (i = 0; i < len; i++) {
				appendFieldsToForm(form, fields[f][i], initial ? initial + "[" + f + "][" + i + "]" : f + "[" + i + "]");
			}
		} 
		else if(fields[f]instanceof Object){
			appendFieldsToForm(form, fields[f], initial ? initial + "[" + f + "]" : f);
		}
		else {
			let input = document.createElement("input");
			input.setAttribute("type", "hidden");
			input.setAttribute("name", initial ? initial + "[" + f + "]" : f);
			input.setAttribute("value", fields[f]);
			form.appendChild(input);
		}
	}
}

export function popupWindow(url, title, w, h) {
    // Fixes dual-screen position                         Most browsers      Firefox
    let dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX;
    let dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY;

    let width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    let height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    let systemZoom = width / window.screen.availWidth;
    let left = (width - w) / 2 / systemZoom + dualScreenLeft
    let top = (height - h) / 2 / systemZoom + dualScreenTop
    let newWindow = window.open(url, title, 'scrollbars=yes, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left);

    // Puts focus on the newWindow
    if(newWindow){
        if (window.focus) newWindow.focus();
        return newWindow;
    }
    else{
        notify.info('We are unable to process your request. Please allow popup window to open.');
    }
}