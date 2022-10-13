/* eslint-disable */
import * as React from 'react';
import { Card, Table, Tag, Tooltip, Button, Select, Row, Col } from 'antd';
import { inject, observer } from 'mobx-react';
import { FormInstance } from 'antd/lib/form';
import {
  EditOutlined,
  StopOutlined,
  CheckSquareOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import { popupConfirm } from '../../lib/popupMessages';
import { IndexDto } from '../../services/indexes/dto/IndexDto';
import { UpdateIndexDto } from '../../services/indexes/dto/updateIndexDto';
import { CreateIndexDto } from '../../services/indexes/dto/createIndexDto';
import { isGranted } from '../../lib/abpUtility';
import FiltrationBox from '../../components/FilterationBox';
import IndexStore from '../../stores/indexStore';
import CreateOrUpdateQuote from './components/CreateOrUpdateQuote';
import { IndexType } from '../../lib/types';

export interface IQuotesProps {
  indexStore?: IndexStore;
}

export interface IQuotesState {
  quoteModalVisible: boolean;
  quoteModalType: string;
  quoteData?: IndexDto;
  meta: {
    page: number;
    pageSize?: number;
    skipCount: number;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
  };
  permissionsGranted: {
    update: boolean;
    create: boolean;
    activation: boolean;
    delete: boolean;
  };
  keyword?: string;
  isActiveFilter?: boolean;
}

const INDEX_PAGE_SIZE_DEFAULT = 12;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

@inject(Stores.IndexStore)
@observer
export class Quotes extends AppComponentBase<IQuotesProps, IQuotesState> {
  resetPasswordFormRef = React.createRef<FormInstance>();

  state = {
    quoteModalType: 'create',
    quoteModalVisible: false,
    quoteData: undefined,
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      skipCount: 0,
      total: 0,
    },
    permissionsGranted: {
      update: false,
      create: false,
      activation: false,
      delete: false,
    },
    keyword: undefined,
    isActiveFilter: undefined,
  };

  // set the state of permissions
  async componentDidMount(): Promise<void> {
    this.setState({
      permissionsGranted: {
        update: isGranted('Indices.Update'),
        create: isGranted('Indices.Create'),
        activation: isGranted('Indices.Activation'),
        delete: isGranted('Indices.Delete'),
      },
    });

    await this.updateQuotesList(this.state.meta.pageSize, 0);
  }

  // update the quotes list
  updateQuotesList = async (maxResultCount: number, skipCount: number): Promise<void> => {
    const { indexStore } = this.props!;
    indexStore!.maxResultCount = maxResultCount;
    indexStore!.skipCount = skipCount;
    indexStore!.isActiveFilter = this.state.isActiveFilter;
    indexStore!.keyword = this.state.keyword;
    indexStore!.getAll(IndexType.Quote);
  };

  // quote activation and deactivation
  onSwitchQuoteActivation = async (quote: IndexDto): Promise<void> => {
    popupConfirm(
      async () => {
        if (quote.isActive) {
          await this.props.indexStore!.indexDeactivation({ id: quote.id });
        } else await this.props.indexStore!.indexActivation({ id: quote.id });
        await this.updateQuotesList(this.state.meta.pageSize, this.state.meta.skipCount);
      },
      quote.isActive
        ? L('AreYouSureYouWantToBlockThisQuote')
        : L('AreYouSureYouWantToActivateThisQuote')
    );
  };

  // open index modal
  openIndexModal = async (quote?: IndexDto) => {
    if (quote) {
      this.setState({ quoteData: quote, quoteModalType: 'edit', quoteModalVisible: true });
    } else {
      this.setState({ quoteData: undefined, quoteModalType: 'create', quoteModalVisible: true });
    }
  };

  // quote delete
  onDeleteQuote = async (id: number): Promise<void> => {
    popupConfirm(async () => {
      await this.props.indexStore!.indexDelete({ id });
      await this.updateQuotesList(this.state.meta.pageSize, this.state.meta.skipCount);
    }, L('AreYouSureYouDeleteThisQuote'));
  };

  // create or update quote
  createOrUpdateQuote = async (values: UpdateIndexDto | CreateIndexDto): Promise<void> => {
    const { quoteModalType } = this.state;
    if (quoteModalType === 'edit') {
      await this.props.indexStore!.updateIndex(values as UpdateIndexDto);
    } else {
      await this.props.indexStore!.createIndex(values as CreateIndexDto);
    }
    await this.updateQuotesList(this.state.meta.pageSize, this.state.meta.skipCount);
    this.setState({
      quoteModalVisible: false,
      quoteData: undefined,
      quoteModalType: 'create',
    });
  };

  // indices Table Columns
  indicesTableColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: L('Name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: L('IsActive'),
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean): JSX.Element => {
        return (
          <Tag color={isActive ? 'green' : 'volcano'} className="ant-tag-disable-pointer">
            {isActive ? L('Active') : L('Inactive')}
          </Tag>
        );
      },
    },
    {
      title: L('Action'),
      key: 'action',
      render: (text: string, item: IndexDto): JSX.Element => {
        const {
          permissionsGranted: { update, activation },
        } = this.state;
        return (
          <div>
            {update && (
              <Tooltip title={L('Edit')}>
                <EditOutlined className="action-icon " onClick={() => this.openIndexModal(item)} />
              </Tooltip>
            )}
            {item.isActive && activation && (
              <Tooltip title={L('Block')}>
                <StopOutlined
                  className="action-icon  red-text"
                  onClick={() => this.onSwitchQuoteActivation(item)}
                />
              </Tooltip>
            )}
            {!item.isActive && activation && (
              <Tooltip title={L('Activate')}>
                <CheckSquareOutlined
                  className="action-icon  green-text"
                  onClick={() => this.onSwitchQuoteActivation(item)}
                />
              </Tooltip>
            )}
            {this.state.permissionsGranted.delete && (
              <Tooltip title={L('Delete')}>
                <DeleteOutlined
                  color="red"
                  className="action-icon"
                  onClick={() => this.onDeleteQuote(item.id)}
                />
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];

  paginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (page: number, pageSize: number): Promise<void> => {
      const temp = this.state;
      temp.meta.pageSize = pageSize;
      this.setState(temp);
      this.updateQuotesList(pageSize, 0);
    },
    onChange: async (page: number): Promise<void> => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateQuotesList(this.state.meta.pageSize, (page - 1) * this.state.meta.pageSize);
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: number, range: number[]): string =>
      `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    const { indices, loadingIndexes, totalCount, isSubmittingIndexes } = this.props.indexStore!;
    const {
      meta: { page, pageSize },
      permissionsGranted: { create },
      isActiveFilter,
      quoteModalVisible,
      quoteData,
      quoteModalType,
    } = this.state;

    const pagination = {
      ...this.paginationOptions,
      total: totalCount,
      current: page,
      pageSize,
    };
    return (
      <Card
        title={
          <div className="page-head">
            <span>{L('Quotes')}</span>
            {create && (
              <Button type="primary" icon={<PlusOutlined />} onClick={() => this.openIndexModal()}>
                {L('AddQuote')}
              </Button>
            )}
          </div>
        }
      >
        <FiltrationBox>
          <Row>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 12 }}
              lg={{ span: 12 }}
              xl={{ span: 8 }}
            >
              <label>{L('IsActive')}</label>
              <Select
                style={{ display: 'block' }}
                showSearch
                optionFilterProp="children"
                onChange={(value: boolean) => {
                  this.setState({
                    isActiveFilter: value,
                  });
                }}
                placeholder={L('SelectStatus')}
                value={isActiveFilter}
              >
                <Select.Option key={0} value={true}>
                  {L('Active')}
                </Select.Option>
                <Select.Option key={1} value={false}>
                  {L('Inactive')}
                </Select.Option>
              </Select>
            </Col>
          </Row>
          <div className="btns-wrap">
            <Button
              type="primary"
              onClick={async () => {
                await this.updateQuotesList(this.state.meta.pageSize, this.state.meta.skipCount);
              }}
            >
              {L('Filter')}
            </Button>
            <Button
              onClick={() => {
                this.setState({ isActiveFilter: undefined }, async () => {
                  await this.updateQuotesList(this.state.meta.pageSize, this.state.meta.skipCount);
                });
              }}
            >
              {L('ResetFilter')}
            </Button>
          </div>
        </FiltrationBox>
        <Table
          pagination={pagination}
          rowKey={(record) => `${record.id}`}
          loading={loadingIndexes}
          dataSource={indices ?? []}
          columns={this.indicesTableColumns}
        />
        {quoteModalVisible && (
          <CreateOrUpdateQuote
            onCancel={() =>
              this.setState({
                quoteModalVisible: false,
                quoteData: undefined,
                quoteModalType: 'create',
              })
            }
            quoteData={quoteData}
            visible={quoteModalVisible}
            modalType={quoteModalType}
            onOk={this.createOrUpdateQuote}
            loading={isSubmittingIndexes}
          />
        )}
      </Card>
    );
  }
}

export default Quotes;
