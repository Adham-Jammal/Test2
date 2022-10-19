/* eslint-disable */
import * as React from 'react';
import { Card, Table } from 'antd';
import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import {
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';
import ReviewStore from '../../stores/reviewStore';
import SearchComponent from '../../components/SearchComponent';
import shopsService from '../../services/shops/shopsService';
import { LiteEntityDto } from '../../services/locations/dto/liteEntityDto';
import { ShopDto } from '../../services/shops/dto/shopDto';
import { ReviewDto } from './../../services/reviews/dto/ReviewDto';


export interface IReviewsProps {
  reviewStore: ReviewStore;
}

export interface IReviewsState {
  meta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount: number;
  };
  keyword?: string;
  maxResultCount: number;
  isHidden: boolean; 
  refId:number | undefined;
  refType: number;

}

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

@inject(Stores.ReviewStore)
@observer
export class Reviews extends AppComponentBase<IReviewsProps, IReviewsState> {
  currentUser: any = undefined;
  shops: LiteEntityDto[] = [];
  shopInfo: ShopDto | undefined = undefined;

  state = {
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount: 0,
    },
    keyword: undefined,
    maxResultCount: 1000,
    isHidden: false, 
    refId: this.shopInfo?.id,
    refType: 0,
  };

  async componentDidMount() {
    try {
      let result2 = await shopsService.getCurrentShopInfo();
      this.shopInfo = result2;
    } catch {
      window.location.href = '/user/shop/complete-registeration';
    }
    let result = await shopsService.getAllLite();
    this.shops = result.items;
    this.updateReviewsList(this.state.meta.pageSize, 0 ,this.shopInfo?.id);
  }
  async updateReviewsList(maxResultCount: number, skipCount: number , refID? : number | undefined) {
    this.props.reviewStore!.maxResultCount = maxResultCount;
    this.props.reviewStore!.refId = refID;
    this.props.reviewStore!.keyword = this.state.keyword;
    this.props.reviewStore!.skipCount = skipCount;
    this.props.reviewStore!.getReviews();
  }

  reviewsTableColumns = [
    {
      title: L('ClientName'),
      dataIndex: 'reviewer',
      key: 'reviewer',
      render: (client: string, item:ReviewDto ) => {
        return item.reviewer.name;
      },
    },
    {
      title: L('rate'),
      dataIndex: 'rate',
      key: 'rate',
    },
    {
      title: L('Comments'),
      dataIndex: 'comment',
      key: 'comment',
    },
    {
      title: L('isHiddenComment'),
      dataIndex: 'isHidden',
      key: 'isHidden',
      render: (client: string, item:ReviewDto ) => {
        return item.isHidden? L('Yes') : L('No');
      },
      },

    // {
    //   title: L('Action'),
    //   key: 'action',
    //   render: (text: string, item: ReviewDto) => (
    //   <div>
        
    //   </div>)
    // },
  ];

  paginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (page: any, pageSize: any) => {
      const temp = this.state;
      temp.meta.pageSize = pageSize;
      this.setState(temp);
      this.updateReviewsList(pageSize, 0 , this.shopInfo?.id);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateReviewsList(this.state.meta.pageSize, (page - 1) * this.state.meta.pageSize , this.shopInfo?.id);
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    
    const reviews = this.props.reviewStore!.reviews;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.reviewStore!.totalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    return (
      <Card title={L('MyReviews')}>
        <SearchComponent
          onSearch={(value: string) => {
            this.setState({ keyword: value }, () => {
              this.updateReviewsList(this.state.meta.pageSize, this.state.meta.skipCount,this.shopInfo?.id);
            });
            console.log(this.state.keyword);
          }}
        />
        <Table
          pagination={pagination} 
          rowKey={(record) => record.id + ''}
          style={{ marginTop: '12px' }}
          loading={this.props.reviewStore!.loadingReviews}
          dataSource={reviews === undefined ? [] : reviews}
          columns={this.reviewsTableColumns}
          
          expandable={{
            expandIcon: ({ expanded, onExpand, record }) =>
              expanded ? (
                <UpOutlined className="expand-icon" onClick={(e) => onExpand(record, e)} />
              ) : (
                <DownOutlined className="expand-icon" onClick={(e) => onExpand(record, e)} />
              ),
            expandedRowRender: (record) => (
              <p className="expanded-row" style={{ margin: 0 }}>
                <span>
                  <b>{L('ClientPhoneNumber')}: </b>
                  {record.reviewer.phoneNumber}
                </span>
                <span>
                  <b>{L('ClientEmail')}: </b>
                  {record.reviewer.emailAddress}
                </span>
              </p>
            ),
            rowExpandable: (record) => true,
          }}
        />
      </Card>
    );
  }
}

export default Reviews;
