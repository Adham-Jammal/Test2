/* eslint-disable */
import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { L } from '../../i18next';

export interface ISearchColumnBoxProps {
  onSearch: (value: any) => void;
}

class SearchColumnBox {
  static searchArray: Array<any> = [];
  keyword: string = '';
  searchedColumns: string[] = [];
  searchInput: any = null;

  handleSearch = (confirm: any, triggerFilter: any) => {
    confirm();
    //triggerFilter();
  };

  handleReset = (clearFilters: any) => {
    clearFilters();
  };

  prepareKeyword = (dataIndex: string): string => {
    if (this.keyword === '')
      SearchColumnBox.searchArray = SearchColumnBox.searchArray.filter(
        (e) => e.column !== dataIndex
      );
    else {
      if (SearchColumnBox.searchArray.some((e) => e.column === dataIndex))
        SearchColumnBox.searchArray.filter((e) => e.column === dataIndex)[0].keyword = this.keyword;
      else
        SearchColumnBox.searchArray.push({
          column: dataIndex,
          keyword: this.keyword,
        });
    }
    return JSON.stringify(SearchColumnBox.searchArray);
  };

  getColumnSearchProps = (
    dataIndex?: any,
    updateState?: any,
    triggerFilters?: any,
    forceUpdateState?: any
  ) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      triggerFilter = triggerFilters,
      forceUpdate = forceUpdateState,
    }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={L('SearchHere')}
          value={selectedKeys[0]}
          onChange={async (e) => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
            this.keyword = e.target.value;
            this.searchedColumns = [...this.searchedColumns, dataIndex];
          }}
          onPressEnter={async () => {
            await updateState(this.prepareKeyword(dataIndex));
            this.handleSearch(confirm, triggerFilter);
          }}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={async () => {
              await updateState(this.prepareKeyword(dataIndex));
              this.handleSearch(confirm, triggerFilter);
            }}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 100 }}
          >
            {L('Search')}
          </Button>
          <Button
            onClick={async () => {
              this.keyword = '';
              await this.handleReset(clearFilters);
              await updateState(this.prepareKeyword(dataIndex));
              await triggerFilter();
              await forceUpdate();
            }}
            size="small"
            style={{ width: 90 }}
          >
            {L('ResetSearch')}
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: any) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilterDropdownVisibleChange: (visible: any) => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: (text: any) =>
      SearchColumnBox.searchArray.some((e) => e.column === dataIndex) ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[
            SearchColumnBox.searchArray.filter((e) => e.column === dataIndex)[0].keyword,
          ]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
}

export default new SearchColumnBox();
