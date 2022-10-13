/* eslint-disable */
import * as React from 'react';
import { Button, Card, Table, Tag, Select, Tooltip } from 'antd';
import { inject, observer } from 'mobx-react';
import {
  EditOutlined,
  PlusOutlined,
  FilterOutlined,
  CheckSquareOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import Stores from '../../stores/storeIdentifier';
import SearchComponent from '../../components/SearchComponent';
import CreateOrUpdateIndex from './components/createOrUpdateIndex';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import localization from '../../lib/localization';
import { EntityDto } from '../../services/dto/entityDto';
import { popupConfirm } from '../../lib/popupMessages';
import IndexStore from '../../stores/indexStore';
import { IndexDto } from '../../services/indexes/dto/IndexDto';
import { UpdateIndexDto } from '../../services/indexes/dto/updateIndexDto';
import { CreateIndexDto } from '../../services/indexes/dto/createIndexDto';
import { isGranted } from '../../lib/abpUtility';
import { IndexType } from '../../lib/types';

export interface IBanksProps {
  indexStore?: IndexStore;
}

export interface IBanksState {
  indexModalVisible: boolean;
  indexModalId: number;
  indexModalType: string;
  meta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    skipCount: number;
    total: number;
  };
  permisssionsGranted: {
    update: boolean;
    create: boolean;
    activation: boolean;
  };
  isActiveFilter?: boolean;
  keyword?: string;
}

declare let abp: any;
const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

@inject(Stores.IndexStore)
@observer
export class Banks extends AppComponentBase<IBanksProps, IBanksState> {
  formRef = React.createRef<FormInstance>();

  state = {
    indexModalVisible: false,
    indexModalId: 0,
    indexModalType: 'create',
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      skipCount: 0,
      total: 0,
    },
    permisssionsGranted: {
      update: false,
      create: false,
      activation: false,
    },
    isActiveFilter: undefined,
    keyword: undefined,
  };

  async componentDidMount() {
    this.setState({
      permisssionsGranted: {
        update: isGranted('Indices.Update'),
        create: isGranted('Indices.Create'),
        activation: isGranted('Indices.Activation'),
      },
    });
    this.updateBanksList(this.state.meta.pageSize, 0);
  }

  async updateBanksList(maxResultCount: number, skipCount: number) {
    this.props.indexStore!.maxResultCount = maxResultCount;
    this.props.indexStore!.skipCount = skipCount;
    this.props.indexStore!.isActiveFilter = this.state.isActiveFilter;
    this.props.indexStore!.keyword = this.state.keyword;
    this.props.indexStore!.getAll(IndexType.Bank);
  }

  async openIndexModal(input: EntityDto) {
    if (input.id === 0) {
      this.props.indexStore!.indexModel = undefined;
      this.setState({ indexModalType: 'create', indexModalId: input.id });
    } else {
      await this.props.indexStore!.getIndex({ id: input.id });
      this.setState({ indexModalType: 'edit', indexModalId: input.id });
    }
    this.setState({ indexModalVisible: !this.state.indexModalVisible });
  }

  getColumnStatusSearchProps = () => ({
    filterDropdown: ({ confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Select
          style={{ width: 188, marginBottom: 8, display: 'block' }}
          showSearch
          optionFilterProp="children"
          onChange={(value: any) => {
            this.setState({ isActiveFilter: value === 3 ? undefined : value === 1 });
          }}
          value={this.state.isActiveFilter === undefined ? 3 : !this.state.isActiveFilter ? 0 : 1}
        >
          <Select.Option key={1} value={1}>
            {L('Activated')}
          </Select.Option>
          <Select.Option key={0} value={0}>
            {L('Deactivated')}
          </Select.Option>
          <Select.Option key={3} value={3}>
            {L('All')}
          </Select.Option>
        </Select>
        <Button
          type="primary"
          onClick={async () => {
            confirm();
            this.updateBanksList(this.state.meta.pageSize, this.state.meta.skipCount);
          }}
          size="small"
          style={{ width: 90, marginRight: 4, marginLeft: 4 }}
        >
          {L('Filter')}
        </Button>
        <Button
          onClick={() => {
            clearFilters();
            this.setState({ isActiveFilter: undefined }, () => {
              this.updateBanksList(this.state.meta.pageSize, this.state.meta.skipCount);
            });
          }}
          size="small"
          style={{ width: 90 }}
        >
          {L('ResetFilter')}
        </Button>
      </div>
    ),
    filterIcon: (filtered: any) => (
      <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
  });

  onSwitchIndexActivation = async (index: IndexDto) => {
    popupConfirm(
      async () => {
        if (index.isActive) await this.props.indexStore!.indexDeactivation({ id: index.id });
        else await this.props.indexStore!.indexActivation({ id: index.id });
        await this.updateBanksList(this.state.meta.pageSize, this.state.meta.skipCount);
      },
      index.isActive
        ? L('AreYouSureYouWantToDeactivateThisBank')
        : L('AreYouSureYouWantToActivateThisBank')
    );
  };

  createOrUpdateIndex = () => {
    const form = this.formRef.current;
    form!.validateFields().then(async (values: any) => {
      if (this.state.indexModalId === 0) {
        await this.props.indexStore!.createIndex(values as CreateIndexDto);
      } else {
        values.id = this.state.indexModalId;
        await this.props.indexStore!.updateIndex(values as UpdateIndexDto);
      }
      await this.updateBanksList(this.state.meta.pageSize, this.state.meta.skipCount);
      this.setState({ indexModalVisible: false });
      form!.resetFields();
    });
  };

  indexesTableColumns = [
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
      render: (isActive: boolean) => {
        return (
          <Tag color={isActive ? 'green' : 'volcano'} className="ant-tag-disable-pointer">
            {isActive ? L('Active') : L('Inactive')}
          </Tag>
        );
      },
      ...this.getColumnStatusSearchProps(),
    },
    {
      title: L('Action'),
      key: 'action',
      width: '10%',
      render: (text: string, item: IndexDto) => (
        <div>
          {this.state.permisssionsGranted.update ? (
            <Tooltip title={L('Edit')}>
              <EditOutlined
                className="action-icon "
                onClick={() => this.openIndexModal({ id: item.id })}
              />
            </Tooltip>
          ) : null}
          {item.isActive ? (
            this.state.permisssionsGranted.activation ? (
              <Tooltip title={L('Block')}>
                <StopOutlined
                  className="action-icon  red-text"
                  onClick={() => this.onSwitchIndexActivation(item)}
                />
              </Tooltip>
            ) : null
          ) : this.state.permisssionsGranted.activation ? (
            <Tooltip title={L('Activate')}>
              <CheckSquareOutlined
                className="action-icon  green-text"
                onClick={() => this.onSwitchIndexActivation(item)}
              />
            </Tooltip>
          ) : null}
        </div>
      ),
    },
  ];

  paginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (page: any, pageSize: any) => {
      const temp = this.state;
      temp.meta.pageSize = pageSize;
      this.setState(temp);
      this.updateBanksList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateBanksList(this.state.meta.pageSize, (page - 1) * this.state.meta.pageSize);
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    const { indices } = this.props.indexStore!;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.indexStore!.totalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    return (
      <Card
        title={
          <div>
            <span>{L('Banks')}</span>
            {this.state.permisssionsGranted.create ? (
              <Button
                type="primary"
                style={{ float: localization.getFloat(), margin: '0 5px' }}
                icon={<PlusOutlined />}
                onClick={() => this.openIndexModal({ id: 0 })}
              >
                {L('AddBank')}
              </Button>
            ) : null}
          </div>
        }
      >
        <SearchComponent
          onSearch={(value: string) => {
            this.setState({ keyword: value }, () => {
              this.updateBanksList(this.state.meta.pageSize, this.state.meta.skipCount);
            });
          }}
        />

        <Table
          pagination={pagination}
          rowKey={(record) => `${record.id}`}
          style={{ marginTop: '12px' }}
          loading={this.props.indexStore!.loadingIndexes}
          dataSource={indices === undefined ? [] : indices}
          columns={this.indexesTableColumns}
        />

        <CreateOrUpdateIndex
          formRef={this.formRef}
          visible={this.state.indexModalVisible}
          onCancel={() =>
            this.setState({
              indexModalVisible: false,
            })
          }
          indexType={IndexType.Bank}
          modalType={this.state.indexModalType}
          onOk={this.createOrUpdateIndex}
          isSubmittingIndex={this.props.indexStore!.isSubmittingIndexes}
          indexStore={this.props.indexStore}
        />
      </Card>
    );
  }
}

export default Banks;
