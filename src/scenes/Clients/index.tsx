/* eslint-disable */
import * as React from 'react';
import { Button, Card, Table, Tag, Select, Row, Col, Tooltip, Input, Space } from 'antd';
import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import { EntityDto } from '../../services/dto/entityDto';
// import { popupConfirm } from '../../lib/popupMessages';
import localization from '../../lib/localization';
import moment from 'moment';
import {
  EditOutlined,
  PlusOutlined,
  EyeOutlined,
  LockOutlined,
  CheckSquareOutlined,
  StopOutlined,
  SearchOutlined,
  UpOutlined,
  DownOutlined,
  FileExcelOutlined,
} from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import ClientStore from '../../stores/clientStore';
import { CreateClientDto } from '../../services/clients/dto/createClientDto';
import { UpdateClientDto } from '../../services/clients/dto/updateClientDto';
import { AddressDto, ClientDto } from '../../services/clients/dto/clientDto';
import CreateOrUpdateClient from './components/createOrUpdateClient';
import ResetPasswordModal from '../../components/ResetPasswordModal';
import ClientDetailsModal from './components/clientDetailsModal';
import userService from '../../services/user/userService';
import utils from '../../utils/utils';
import timingHelper from '../../lib/timingHelper';
import SearchComponent from '../../components/SearchComponent';
import FilterationBox from '../../components/FilterationBox';
import { popupConfirm } from '../../lib/popupMessages';
import Highlighter from 'react-highlight-words';
import { GenderType, UserStatus } from '../../lib/types';
import ExcellentExport from 'excellentexport';

export interface IClientsProps {
  clientStore?: ClientStore;
}

const colLayout = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 8 },
  lg: { span: 6 },
  xl: { span: 6 },
  xxl: { span: 6 },
};
export interface IClientsState {
  clientModalVisible: boolean;
  resetPasswordModalVisible: boolean;
  clientDetailsModalVisible: boolean;
  clientId: number;
  clientsModalId: number;
  clientsModalType: string;
  meta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    skipCount: number;
    pageTotal: number;
    total: number;
  };
  permisssionsGranted: {
    update: boolean;
    create: boolean;
    activation: boolean;
    resetPassword: boolean;
  };
  searchText: string;
  searchedColumn: string;
  keyword?: string;
  isActiveFilter?: boolean;
}

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];
declare var abp: any;

@inject(Stores.ClientStore)
@observer
export class Clients extends AppComponentBase<IClientsProps, IClientsState> {
  formRef = React.createRef<FormInstance>();
  resetPasswordFormRef = React.createRef<FormInstance>();
  currentUser: any = undefined;
  searchInput: any = null;
  state = {
    searchText: '',
    searchedColumn: '',
    clientModalVisible: false,
    resetPasswordModalVisible: false,
    clientDetailsModalVisible: false,
    clientId: 0,
    clientsModalId: 0,
    clientsModalType: 'create',
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      skipCount: 0,
      pageTotal: 1,
      total: 0,
    },
    permisssionsGranted: {
      update: false,
      create: false,
      activation: false,
      resetPassword: false,
    },
    // filter:{
    //   clientCode:undefined,
    //   clientPhoneNumber:undefined,
    //   clientEmail:undefined,
    //   clientName:undefined,
    //   clientActivation:undefined
    // }
    keyword: undefined,
    isActiveFilter: undefined,
  };

  handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters: any) => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  getColumnSearchProps = (dataIndex: any) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              this.setState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
              });
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: any) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value: any, record: any) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: (visible: any) => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: (text: any) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  async componentDidMount() {
    this.currentUser = await userService.get({ id: abp.session.userId });
    this.setState({
      permisssionsGranted: {
        update: (await utils.checkIfGrantedPermission('Clients.Update')).valueOf(),
        create: (await utils.checkIfGrantedPermission('Clients.Create')).valueOf(),
        activation: (await utils.checkIfGrantedPermission('Clients.Activation')).valueOf(),
        resetPassword: (await utils.checkIfGrantedPermission('Clients.ResetPassword')).valueOf(),
      },
    });
    this.updateClientsList(this.state.meta.pageSize, 0);
  }

  async updateClientsList(maxResultCount: number, skipCount: number) {
    this.props.clientStore!.maxResultCount = maxResultCount;
    this.props.clientStore!.skipCount = skipCount;
    this.props.clientStore!.keyword = this.state.keyword;
    this.props.clientStore!.isActiveFilter = this.state.isActiveFilter;
    this.props.clientStore!.getClients();
    this.props.clientStore!.getClientsForExport();
  }

  async openClientModal(entityDto: EntityDto) {
    if (entityDto.id === 0) {
      this.props.clientStore!.clientModel = undefined;
      this.setState({ clientsModalType: 'create', clientsModalId: entityDto.id });
    } else {
      await this.props.clientStore!.getClient(entityDto);

      this.setState({ clientsModalType: 'edit', clientsModalId: entityDto.id });
    }
    this.setState({
      clientModalVisible: !this.state.clientModalVisible,
      clientsModalId: entityDto.id,
    });
  }

  openResetPasswordModal(clientId: number) {
    this.setState({ clientId: clientId, resetPasswordModalVisible: true });
  }

  async openClientDetailsModal(entityDto: EntityDto) {
    await this.props.clientStore!.getClient(entityDto);
    this.setState({
      clientDetailsModalVisible: !this.state.clientDetailsModalVisible,
      clientsModalId: entityDto.id,
    });
    await this.props.clientStore!.getHealthProfileAnswers(entityDto);
    await this.props.clientStore!.getPersonalityAnswers(entityDto);
    await this.props.clientStore!.getChallenges({
      clientId: entityDto.id,
      maxResultCount: 4,
      skipCount: 0,
    });
    await this.props.clientStore!.getEvents({
      clientId: entityDto.id,
      maxResultCount: 4,
      skipCount: 0,
    });
    await this.props.clientStore!.getToDoList({
      clientId: entityDto.id,
      maxResultCount: 4,
      skipCount: 0,
    });
    await this.props.clientStore!.getAppointments({
      clientId: entityDto.id,
      maxResultCount: 4,
      skipCount: 0,
    });
    await this.props.clientStore!.getPositiveHabit({
      clientId: entityDto.id,
      maxResultCount: 4,
      skipCount: 0,
    });
    await this.props.clientStore!.getDreams({
      clientId: entityDto.id,
      maxResultCount: 4,
      skipCount: 0,
    });
    await this.props.clientStore!.getDishes({
      clientId: entityDto.id,
      maxResultCount: 4,
      skipCount: 0,
    });
    await this.props.clientStore!.getMoments({
      clientId: entityDto.id,
      maxResultCount: 4,
      skipCount: 0,
    });
    await this.props.clientStore!.getSessions({
      clientId: entityDto.id,
      maxResultCount: 4,
      skipCount: 0,
    });
  }
  createOrUpdateClient = () => {
    const form = this.formRef.current;
    form!.validateFields().then(async (values: any) => {
      if (this.state.clientsModalId === 0) {
        await this.props.clientStore!.createClient(values as CreateClientDto);
      } else {
        values.id = this.state.clientsModalId;
        await this.props.clientStore!.updateClient(values as UpdateClientDto);
      }
      await this.props.clientStore!.getClients();
      this.setState({ clientModalVisible: false });
      form!.resetFields();
    });
  };

  onSwitchClientActivation = async (client: ClientDto) => {
    popupConfirm(
      async () => {
        if (client.status === UserStatus.Active)
          await this.props.clientStore!.clientDeactivation({ id: client.id });
        else await this.props.clientStore!.clientActivation({ id: client.id });
        await this.updateClientsList(this.state.meta.pageSize, this.state.meta.skipCount);
      },
      client.status === UserStatus.Active
        ? L('AreYouSureYouWantToBlockThisClient')
        : L('AreYouSureYouWantToActivateThisClient')
    );
  };

  resolveStatus = (status: number) => {
    switch (status) {
      case UserStatus.Active:
        return (
          <Tag color={'green'} className="ant-tag-disable-pointer">
            {L('Active')}
          </Tag>
        );
      case UserStatus.Blocked:
        return (
          <Tag color={'red'} className="ant-tag-disable-pointer">
            {L('Blocked')}
          </Tag>
        );
      case UserStatus.Inactive:
        return (
          <Tag color={'volcano'} className="ant-tag-disable-pointer">
            {L('Inactive')}
          </Tag>
        );
    }
    return null;
  };

  clientsTableColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: L('Name'),
      dataIndex: 'fullName',
      key: 'fullName',
      // ...this.getColumnSearchProps('fullName'),
    },

    {
      title: L('LastLoginTime'),
      dataIndex: 'lastLoginDate',
      key: 'lastLoginDate',
      render: (lastLoginDate: string) => {
        return lastLoginDate
          ? moment(lastLoginDate).format(timingHelper.defaultDateTimeFormat)
          : L('NotAvailable');
      },
    },
    {
      title: L('Status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: UserStatus) => {
        return this.resolveStatus(status);
      },
    },
    {
      title: L('Action'),
      key: 'action',
      render: (text: string, item: ClientDto) => (
        <div>
          <Tooltip title={L('Details')}>
            <EyeOutlined
              className="action-icon "
              onClick={() => this.openClientDetailsModal({ id: item.id })}
            />
          </Tooltip>
          {this.state.permisssionsGranted.update ? (
            <Tooltip title={L('Edit')}>
              <EditOutlined
                className="action-icon "
                onClick={() => this.openClientModal({ id: item.id })}
              />
            </Tooltip>
          ) : null}
          {item.status == UserStatus.Active ? (
            this.state.permisssionsGranted.activation ? (
              <Tooltip title={L('Block')}>
                <StopOutlined
                  className="action-icon  red-text"
                  onClick={() => this.onSwitchClientActivation(item)}
                />
              </Tooltip>
            ) : null
          ) : this.state.permisssionsGranted.activation ? (
            <Tooltip title={L('Activate')}>
              <CheckSquareOutlined
                className="action-icon  green-text"
                onClick={() => this.onSwitchClientActivation(item)}
              />
            </Tooltip>
          ) : null}
          {this.state.permisssionsGranted.resetPassword ? (
            <Tooltip title={L('ResetPassword')}>
              <LockOutlined
                className="action-icon "
                onClick={() => this.openResetPasswordModal(item.id)}
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
      this.updateClientsList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateClientsList(this.state.meta.pageSize, (page - 1) * this.state.meta.pageSize);
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    const clients = this.props.clientStore!.clients;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.clientStore!.totalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    return (
      <Card
        title={
          <div>
            <span>{L('Clients')}</span>
            {this.state.permisssionsGranted.create ? (
              <Button
                type="primary"
                style={{ float: localization.getFloat() }}
                icon={<PlusOutlined />}
                onClick={() => this.openClientModal({ id: 0 })}
              >
                {L('AddClient')}
              </Button>
            ) : null}
            {!this.props.clientStore!.loadingClientsForExport && (
              <a
                download="clients.xlsx"
                className="ant-btn ant-btn-default export-btn"
                style={{ float: localization.getFloat(), margin: '0 5px' }}
                id="export"
                href="#"
                onClick={() => {
                  return ExcellentExport.convert(
                    {
                      anchor: document.getElementById('export') as HTMLAnchorElement,
                      filename: L('Clients'),
                      format: 'xlsx',
                    },
                    [
                      {
                        name: L('Clients'),
                        from: { table: document.getElementById('datatable') as HTMLTableElement },
                      },
                    ]
                  );
                }}
              >
                <FileExcelOutlined /> {L('ExportToExcel')}
              </a>
            )}
          </div>
        }
      >
        <SearchComponent
          onSearch={(value: string) => {
            this.setState({ keyword: value }, () => {
              this.updateClientsList(this.state.meta.pageSize, this.state.meta.skipCount);
            });
          }}
        />
        <table id="datatable" style={{ display: 'none' }}>
          <thead>
            <tr>
              <td>{L('ID')}</td>
              <td>{L('Name')}</td>
              <td>{L('Code')}</td>
              <td>{L('UserName')}</td>

              <td>{L('Email')}</td>
              <td>{L('PhoneNumber')}</td>
              <td>{L('Gender')}</td>
              <td>{L('HasAvatar')}</td>
              <td>{L('City')}</td>
              <td>{L('Addresses')}</td>
              <td>{L('BirthDate')}</td>
              <td>{L('PaymentsCount')}</td>

              <td>{L('LastLoginTime')}</td>
              <td>{L('Status')}</td>
              <td>{L('CreationDate')}</td>
            </tr>
          </thead>
          <tbody>
            {this.props.clientStore!.clientsForExport.length > 0 &&
              this.props.clientStore!.clientsForExport.map((client: ClientDto, index: number) => {
                return (
                  <tr key={index}>
                    <td>{client.id}</td>
                    <td>{client.fullName}</td>
                    <td>{client.code}</td>
                    <td>{client.userName}</td>
                    <td>{client.emailAddress}</td>
                    <td>{client.countryCode + '' + client.phoneNumber}</td>
                    <td>
                      {client.gender === GenderType.Female
                        ? L('Female')
                        : client.gender === GenderType.Male
                        ? L('Male')
                        : L('Other')}
                    </td>
                    <td>{client.hasAvatar ? L('Yes') : L('No')}</td>
                    <td>{client.city ? client.city.text : L('NotAvailable')}</td>
                    <td>
                      {client.addresses && client.addresses.length > 0
                        ? client.addresses.map(
                            (address: AddressDto) =>
                              address.city.text + ', ' + address.street + ' - '
                          )
                        : L('NotAvailable')}
                    </td>
                    <td>{moment(client.birthDate).format(timingHelper.defaultDateFormat)}</td>
                    <td>{client.paymentsCount}</td>
                    <td>
                      {client.lastLoginTime
                        ? moment(client.lastLoginTime).format(timingHelper.defaultDateTimeFormat)
                        : L('NotAvailable')}
                    </td>
                    <td>
                      {client.status === UserStatus.Inactive
                        ? L('Inactive')
                        : client.status === UserStatus.Active
                        ? L('Active')
                        : L('Blocked')}
                    </td>
                    <td>{moment(client.creationTime).format(timingHelper.defaultDateFormat)}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <FilterationBox>
          <Row>
            <Col {...colLayout}>
              <label>{L('Status')}</label>
              <Select
                style={{ display: 'block' }}
                showSearch
                optionFilterProp="children"
                onChange={(value: any) => {
                  this.setState({
                    isActiveFilter: value === 3 ? undefined : value === 1 ? true : false,
                  });
                }}
                value={
                  this.state.isActiveFilter === undefined ? 3 : !this.state.isActiveFilter ? 0 : 1
                }
              >
                <Select.Option key={0} value={0}>
                  {L('Inactive')}
                </Select.Option>
                <Select.Option key={1} value={1}>
                  {L('Active')}
                </Select.Option>
                <Select.Option key={2} value={2}>
                  {L('Blocked')}
                </Select.Option>
                <Select.Option key={3} value={3}>
                  {L('All')}
                </Select.Option>
              </Select>
            </Col>
          </Row>
          <Row style={{ marginTop: '15px' }}>
            <Button
              type="primary"
              onClick={async () => {
                await this.updateClientsList(this.state.meta.pageSize, this.state.meta.skipCount);
              }}
              style={{ width: 90 }}
            >
              {L('Filter')}
            </Button>
            <Button
              onClick={() => {
                this.setState({ isActiveFilter: undefined }, async () => {
                  await this.updateClientsList(this.state.meta.pageSize, this.state.meta.skipCount);
                });
              }}
              style={{ width: 90, marginRight: 4, marginLeft: 4 }}
            >
              {L('ResetFilter')}
            </Button>
          </Row>
        </FilterationBox>

        <Table
          pagination={pagination}
          rowKey={(record) => record.id + ''}
          style={{ marginTop: '12px' }}
          loading={this.props.clientStore!.loadingClients}
          dataSource={clients === undefined ? [] : clients}
          columns={this.clientsTableColumns}
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
                  <b> {L('Code')}: </b>
                  {record.code}
                </span>
                <span>
                  <b> {L('Email')}: </b>
                  {record.emailAddress}
                </span>
                <span>
                  <b>{L('PhoneNumber')}: </b>
                  {record.countryCode
                    ? record.countryCode + '' + record.phoneNumber
                    : record.phoneNumber}
                </span>

                <span>
                  <b>{L('City')}:</b> {record.city ? record.city?.text : L('NotAvailable')}
                </span>

                <span>
                  <b> {L('JoinDate')}: </b>
                  {moment(record.creationTime).format(timingHelper.defaultDateFormat)}
                </span>
              </p>
            ),
            rowExpandable: (record) => true,
          }}
        />

        <CreateOrUpdateClient
          formRef={this.formRef}
          visible={this.state.clientModalVisible}
          onCancel={() =>
            this.setState({
              clientModalVisible: false,
            })
          }
          modalType={this.state.clientsModalType}
          onOk={this.createOrUpdateClient}
          isSubmittingClient={this.props.clientStore!.isSubmittingClient}
          clientStore={this.props.clientStore}
        />

        <ResetPasswordModal
          formRef={this.resetPasswordFormRef}
          isOpen={this.state.resetPasswordModalVisible}
          userId={this.state.clientId}
          onClose={() =>
            this.setState({
              resetPasswordModalVisible: false,
            })
          }
        />

        <ClientDetailsModal
          visible={this.state.clientDetailsModalVisible}
          onCancel={() =>
            this.setState({
              clientDetailsModalVisible: false,
            })
          }
          id={this.state.clientsModalId}
          clientStore={this.props.clientStore!}
        />
      </Card>
    );
  }
}

export default Clients;
