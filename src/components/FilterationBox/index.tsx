/* eslint-disable */

import { DownOutlined, UpOutlined } from '@ant-design/icons';
import * as React from 'react';
import { L } from '../../i18next';
import './index.less';
const FilterationBox = (props: any) => {
  const [filterationBoxVisible, setFilterationBoxVisible] = React.useState(false);
  return (
    <div className="filteration-area">
      <span
        onClick={() => {
          setFilterationBoxVisible(!filterationBoxVisible);
        }}
        className="icon"
      >
        {filterationBoxVisible ? <UpOutlined /> : <DownOutlined />} &nbsp;
        {filterationBoxVisible ? L('HideAdvancedFilters') : L('ShowAdvancedFilters')}
      </span>
      <div className={filterationBoxVisible ? 'filteration-box' : 'filteration-box closed'}>
        {props.children}
      </div>
    </div>
  );
};
export default FilterationBox;
