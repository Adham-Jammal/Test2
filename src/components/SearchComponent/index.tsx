/* eslint-disable */
import * as React from 'react';
import { Component } from 'react';
import { Input } from 'antd';
import { L } from '../../i18next';
import './index.less';

export interface ISearchComponentProps {
  onSearch: (value: any) => void;
  placeHolder?: string;
}

class SearchComponent extends Component<ISearchComponentProps, any> {
  render() {
    const { onSearch, placeHolder = L('SearchHere') } = this.props;
    return (
      <Input.Search
        placeholder={placeHolder}
        allowClear
        className="table-search"
        enterButton
        size="middle"
        onSearch={onSearch}
      />
    );
  }
}

export default SearchComponent;
