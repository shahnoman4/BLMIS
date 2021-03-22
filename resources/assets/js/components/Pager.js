import React from 'react';

class Pager extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            pageNo: 1
        };
        this.page = this.page.bind(this);
    }
    navigate(pageNo){
        if(pageNo != this.state.pageNo){
            this.props.onNavigate(pageNo);
            this.setState({pageNo});
        }
    }
    prev(){
        this.navigate(this.state.pageNo - 1);
    }
    next(){
        this.navigate(this.state.pageNo + 1);
    }
    page(e){
        this.navigate(parseInt(e.target.dataset.page));
    }
    render(){
        let options = this.props.options;
        return(
            <div className="data-pager">
                <div className="pager-btns text-center">
                    {this.renderButtons(options)}
                </div>
            </div>
        );
    }
    renderButtons(options){
        if(this.state.pageNo != this.props.options.pageNo){
            this.state.pageNo = this.props.options.pageNo;
        }
        let pageSize = options.pageSize, dataSize = options.count, maxBtns = Math.max(1, Math.ceil(dataSize / pageSize));
        let btnCount
        if(options.buttonCount && options.buttonCount < maxBtns){
            btnCount = options.buttonCount;
        }
        else{
            btnCount = Math.min(10, maxBtns);
        }
        let offset = Math.max(0, this.state.pageNo - btnCount);
        let btns = [];
        btns.push(<button key="0" className="btn btn-default" disabled={this.state.pageNo == 1} onClick={this.prev.bind(this)}>Prev</button>);
        for(let i = offset + 1; i <= offset + btnCount; i++){
            btns.push(<button key={i} className={"btn " + (this.state.pageNo == i ? "btn-primary": "btn-default")} onClick={this.page} data-page={i}>{i}</button>);
        }
        btns.push(<button key={maxBtns + 1} className="btn btn-default" disabled={this.state.pageNo == maxBtns} onClick={this.next.bind(this)}>Next</button>);
        
        return btns;
    }
}

export default Pager;