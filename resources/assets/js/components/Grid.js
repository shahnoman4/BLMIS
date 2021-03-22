import React from "react";

export default class Grid extends React.Component {
  constructor(props) {
    super(props);
    this.filters = {};
    let options = this.props.options;
    this.props.init &&
      this.props.init({
        read: params => {
          if (options.read) {
            if (options.pageable) {
              if (this.pager) {
                params = _.extend(
                  {
                    page: this.pager.state.page,
                    per_page: this.pager.state.pageSize
                  },
                  params
                );
                options.read(params);
                if (params.page != this.pager.state.page) {
                  this.pager.setState({ page: params.page });
                }
              }
            } else {
              options.read(params);
            }
          }
        },
        filter: function(_filter) {
          this.filters = _.extend(this.filters, _filter);
          let params = this.filters;
          if (options.pageable) {
            params.page = 1;
          }
          this.read(params);
        }
      });
  }
  render() {
    let _data = this.props.data || [];
    let options = this.props.options;
    let columns = options.columns;
    let _pager;
    if (options.pageable) {
      let { data, ...pager } = this.props.data;
      _data = data || [];
      _pager = pager;
    }
    console.log("LOG DATA-->", this.props);
    console.log("IS isDashboard--->", this.props.isDashbord);
    return (
      <React.Fragment>
        <table {..._.get(this.props.options, "table.props")}>
          {this.renderColSet(columns)}
          {this.renderHeader(columns)}
          {this.renderBody(columns, _data)}
        </table>
        {_.isEmpty(_data) ? (
          <div className="text-center no-data">No data available</div>
        ) : null}

        {options.pageable ? (
          <Pager
            {...options.pageable}
            {..._pager}
            onNavigate={options.read ? options.read : () => {}}
            init={pager => {
              this.pager = pager;
            }}
            isDashbord={this.props.isDashbord}
          />
        ) : null}
      </React.Fragment>
    );
  }
  renderColSet(columns) {
    let cols = [];
    for (let i = 0; i < columns.length; i++) {
      if (columns[i].width) {
        cols.push(<col key={i} width={columns[i].width} />);
      } else {
        cols.push(<col key={i} />);
      }
    }
    return <colgroup>{cols}</colgroup>;
  }
  renderHeader(columns) {
    let cells = [];
    for (let i = 0; i < columns.length; i++) {
      cells.push(
        <th
          key={i}
          data-field={columns[i].field}
          {..._.get(columns[i], "header.props")}
          {..._.get(this.props.options, "th.props")}
        >
          {columns[i].title}
        </th>
      );
    }
    return (
      <thead {..._.get(this.props.options, "thead.props")}>
        <tr>{cells}</tr>
      </thead>
    );
  }
  renderBody(columns, data) {
    let rows = [];
    let pathName = window.location.pathname
      ? window.location.pathname.split("/")
      : [];
    console.log("INCLUDES -->", data);
    let isMatured = _.includes(pathName, "matured");
    for (let r = 0; r < data.length; r++) {
      let cells = [];
      for (let c = 0; c < columns.length; c++) {
        console.log("APPROVABLE", data[r].is_approvable);
        {
          isMatured &&
            data[r].is_approvable &&
            cells.push(
              <td key={r + c} {..._.get(columns[c], "props")}>
                {_.isString(this.cellContent(columns[c], data[r])) ||
                _.isNumber(this.cellContent(columns[c], data[r])) ||
                React.isValidElement(this.cellContent(columns[c], data[r]))
                  ? isMatured &&
                    this.cellContent(columns[c], data[r]) === "Circulated"
                    ? "Mature"
                    : this.cellContent(columns[c], data[r])
                  : ""}
              </td>
            );
        }
        {
          !isMatured &&
            cells.push(
              <td key={r + c} {..._.get(columns[c], "props")}>
                {_.isString(this.cellContent(columns[c], data[r])) ||
                _.isNumber(this.cellContent(columns[c], data[r])) ||
                React.isValidElement(this.cellContent(columns[c], data[r]))
                  ? isMatured &&
                    this.cellContent(columns[c], data[r]) === "Circulated"
                    ? "Mature"
                    : this.cellContent(columns[c], data[r])
                  : ""}
              </td>
            );
        }
      }
      console.log("HISTORY", window.location.pathname);
      rows.push(
        <tr className={"table-row" + (r % 2 == 1 ? " alt" : "")} key={r}>
          {cells}
        </tr>
      );
    }
    return <tbody {..._.get(this.props.options, "tbody.props")}>{rows}</tbody>;
  }
  cellContent(column, data) {
    let value = _.get(data, column.field);
    if (column.template) {
      return column.template(value, data);
    }
    if (column.values) {
      return (
        _.find(column.values, {
          value: column.type == "number" ? +value : value
        }) || { text: "" }
      ).text;
    }
    return value;
  }
}

export class Pager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      pageSize: props.pageSize || 10
    };
    this.page = this.page.bind(this);
    // this.props.init && this.props.init(this);
  }
  navigate(pageNo) {
    if (pageNo != this.state.page) {
      this.props.onNavigate({ page: pageNo, per_page: this.state.pageSize });
      this.setState({ page: pageNo });
    }
  }
  prev() {
    this.navigate(this.state.page - 1);
  }
  next() {
    this.navigate(this.state.page + 1);
  }
  page(e) {
    this.navigate(parseInt(e.target.dataset.page));
  }
  componentDidMount() {
    this.props.init && this.props.init(this);
  }
  render() {
    return (
      <nav className="relative" aria-label="Grid pages">
        {!this.props.isDashbord && (
          <React.Fragment>
            <ul className="pagination justify-content-center">
              {this.renderButtons(this.props)}
            </ul>
            <div className="paging-info">
              Showing {this.props.from ? this.props.from : "0"} to{" "}
              {this.props.to ? this.props.to : "0"} of {this.props.total}{" "}
              records
            </div>
          </React.Fragment>
        )}
      </nav>
    );
  }
  renderButtons(options) {
    if (!this.props.total) {
      return null;
    }
    if (this.props.page && this.state.page != this.props.page) {
      this.state.page = this.props.page;
    }
    let pageSize = this.state.pageSize,
      dataSize = this.props.total,
      maxBtns = Math.max(1, Math.ceil(dataSize / pageSize));
    let btnCount;
    if (this.props.buttonCount && this.props.buttonCount < maxBtns) {
      btnCount = options.buttonCount;
    } else {
      btnCount = Math.min(10, maxBtns);
    }
    let offset = Math.max(0, this.state.page - btnCount);
    let btns = [];
    {
      let disabled = this.state.page == 1;
      btns.push(
        <li
          key="0"
          className={"page-item" + (disabled ? " disabled" : "")}
          onClick={disabled ? () => {} : this.prev.bind(this)}
        >
          <span className="link page-link" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
            <span className="sr-only">Previous</span>
          </span>
        </li>
      );
    }
    for (let i = offset + 1; i <= offset + btnCount; i++) {
      btns.push(
        <li
          key={i}
          className={"page-item" + (this.state.page == i ? " active" : "")}
        >
          <span className="link page-link" onClick={this.page} data-page={i}>
            {i}
          </span>
        </li>
      );
    }

    {
      let disabled = this.state.page == maxBtns;
      btns.push(
        <li
          key={maxBtns + 1}
          className={"page-item" + (disabled ? " disabled" : "")}
          onClick={disabled ? () => {} : this.next.bind(this)}
        >
          <span className="link page-link" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
            <span className="sr-only">Next</span>
          </span>
        </li>
      );
    }

    return btns;
  }
}
