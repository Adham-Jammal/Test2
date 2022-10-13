/* eslint-disable */
import * as React from 'react';
import { Button, Card, Table, Tag, Select, Row, Col, Tooltip } from 'antd';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import ExcellentExport from 'excellentexport';
import {
  DeleteOutlined,
  LockOutlined,
  EditOutlined,
  PlusOutlined,
  EyeOutlined,
  StopOutlined,
  CheckSquareOutlined,
  UpOutlined,
  DownOutlined,
  FileExcelOutlined,
} from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import { EntityDto } from '../../services/dto/entityDto';
import { popupConfirm } from '../../lib/popupMessages';
import localization from '../../lib/localization';
import AdminStore from '../../stores/adminStore';
import { AdminDto } from '../../services/admins/dto/adminDto';
import ResetPasswordModal from '../../components/ResetPasswordModal';
import timingHelper from '../../lib/timingHelper';
import { GetAllPermissionsOutput } from '../../services/role/dto/getAllPermissionsOutput';
import userService from '../../services/user/userService';
import CreateOrUpdateAdmin from './components/createOrUpdateAdmin';
import AdminDetailsModal from './components/adminDetialsModal';
import FilterationBox from '../../components/FilterationBox';
import { isGranted } from '../../lib/abpUtility';
import { UserStatus } from '../../lib/types';

export interface IAdminsProps {
  adminStore?: AdminStore;
}
const colLayout = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 8 },
  lg: { span: 6 },
  xl: { span: 6 },
  xxl: { span: 6 },
};
export interface IAdminsState {
  adminModalVisible: boolean;
  resetPasswordModalVisible: boolean;
  adminId: number;
  adminsModalId: number;
  adminsModalType: string;
  adminDetailsModalVisible: boolean;
  treeData: any[];
  meta: {
    page: number;
    pageSize: number | undefined;
    skipCount: number;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
  };
  permisssionsGranted: {
    delete: boolean;
    update: boolean;
    create: boolean;
    activation: boolean;
    resetPassword: boolean;
  };
  keyword?: string;
  isActiveFilter?: boolean;
}
declare let abp: any;

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

@inject(Stores.AdminStore)
@observer
export class Admins extends AppComponentBase<IAdminsProps, IAdminsState> {
  formRef = React.createRef<FormInstance>();

  resetPasswordFormRef = React.createRef<FormInstance>();

  currentUser: any = undefined;

  state = {
    adminModalVisible: false,
    adminsModalId: 0,
    treeData: [],
    resetPasswordModalVisible: false,
    adminId: 0,
    adminsModalType: 'create',
    adminDetailsModalVisible: false,
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      skipCount: 0,
      total: 0,
    },
    permisssionsGranted: {
      delete: false,
      update: false,
      create: false,
      activation: false,
      resetPassword: false,
    },
    keyword: undefined,
    isActiveFilter: undefined,
  };

  async componentDidMount() {
    this.currentUser = await userService.get({ id: abp.session.userId });
    this.setState({
      permisssionsGranted: {
        delete: isGranted('Admins.Delete'),
        update: isGranted('Admins.Update'),
        create: isGranted('Admins.Create'),
        activation: isGranted('Admins.Activation'),
        resetPassword: isGranted('Admins.ResetPassword'),
      },
    });

    await this.updateAdminsList(this.state.meta.pageSize, 0);
  }

  async updateAdminsList(maxResultCount: number, skipCount: number) {
    this.props.adminStore!.maxResultCount = maxResultCount;
    this.props.adminStore!.skipCount = skipCount;
    this.props.adminStore!.isActiveFilter = this.state.isActiveFilter;
    this.props.adminStore!.keyword = this.state.keyword;
    this.props.adminStore!.getAdmins();
    this.props.adminStore!.getAdminsForExport();
  }

  openResetPasswordModal(adminId: number) {
    this.setState({ adminId, resetPasswordModalVisible: true });
  }

  async openAdminModal(entityDto: EntityDto) {
    this.props.adminStore!.adminModel = undefined;
    if (entityDto.id === 0) {
      this.setState({ adminsModalType: 'create', adminsModalId: entityDto.id });
    } else {
      await this.props.adminStore!.getAdmin(entityDto);
      this.setState({ adminsModalType: 'edit', adminsModalId: entityDto.id });
    }
    //  await this.updateAdminsList(this.state.meta.pageSize, this.state.meta.skipCount);

    this.setState({
      adminModalVisible: !this.state.adminModalVisible,
      adminsModalId: entityDto.id,
    });
  }

  async openAdminDetailsModal(entityDto: EntityDto) {
    await this.props.adminStore!.getAdmin(entityDto);
    const treeData: any[] = [];
    if (
      treeData.length === 0 &&
      this.props.adminStore!.adminModel !== undefined &&
      this.props.adminStore!.adminModel.permissions !== undefined
    ) {
      this.props.adminStore!.adminModel!.permissions!.map((x: GetAllPermissionsOutput) => {
        if (x.children.length > 0) {
          const childrens: any[] = [];
          for (let i = 0; i < x.children.length; i++) {
            childrens.push({ title: L(x.children[i].name), key: x.children[i].key });
          }
          treeData.push({ title: L(x.name), key: x.key, children: childrens });
        } else {
          treeData.push({ title: L(x.name), key: x.key });
        }
        return treeData;
      });
    }
    this.setState({
      treeData,
      adminDetailsModalVisible: !this.state.adminDetailsModalVisible,
      adminsModalId: entityDto.id,
    });
  }

  onSwitchAdminActivation = async (admin: AdminDto) => {
    popupConfirm(
      async () => {
        if (admin.status === UserStatus.Active) {
          await this.props.adminStore!.adminDeactivation({ id: admin.id });
        } else await this.props.adminStore!.adminActivation({ id: admin.id });
        await this.updateAdminsList(this.state.meta.pageSize, this.state.meta.skipCount);
      },
      admin.status === UserStatus.Active
        ? L('AreYouSureYouWantToBlockThisAdmin')
        : L('AreYouSureYouWantToActivateThisAdmin')
    );
  };

  onDeleteAdmin = async (input: EntityDto) => {
    popupConfirm(async () => {
      await this.props.adminStore!.deleteAdmin({ id: input.id });
      await this.updateAdminsList(this.state.meta.pageSize, this.state.meta.skipCount);
    }, L('AreYouSureYouWantToDeleteThisAdmin'));
  };

  resolveStatus = (status: number) => {
    switch (status) {
      case UserStatus.Active:
        return (
          <Tag color="green" className="ant-tag-disable-pointer">
            {L('Active')}
          </Tag>
        );
      case UserStatus.Blocked:
        return (
          <Tag color="red" className="ant-tag-disable-pointer">
            {L('Blocked')}
          </Tag>
        );
      case UserStatus.Inactive:
        return (
          <Tag color="volcano" className="ant-tag-disable-pointer">
            {L('Inactive')}
          </Tag>
        );
    }
    return null;
  };

  adminsTableColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: L('Name'),
      dataIndex: 'fullName',
      key: 'fullName',
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
      render: (text: string, item: AdminDto) => (
        <div>
          <Tooltip title={L('Details')}>
            <EyeOutlined
              className="action-icon "
              onClick={() => this.openAdminDetailsModal({ id: item.id })}
            />
          </Tooltip>
          {item.name !== 'admin' && this.state.permisssionsGranted.update ? (
            <Tooltip title={L('Edit')}>
              <EditOutlined
                className="action-icon "
                onClick={() => this.openAdminModal({ id: item.id })}
              />
            </Tooltip>
          ) : null}
          {item.status === UserStatus.Active ? (
            item.name !== 'admin' && this.state.permisssionsGranted.activation ? (
              <Tooltip title={L('Block')}>
                <StopOutlined
                  className="action-icon  red-text"
                  onClick={() => this.onSwitchAdminActivation(item)}
                />
              </Tooltip>
            ) : null
          ) : item.name !== 'admin' && this.state.permisssionsGranted.activation ? (
            <Tooltip title={L('Activate')}>
              <CheckSquareOutlined
                className="action-icon  green-text"
                onClick={() => this.onSwitchAdminActivation(item)}
              />
            </Tooltip>
          ) : null}
          {item.name !== 'admin' && this.state.permisssionsGranted.delete ? (
            <Tooltip title={L('Delete')}>
              <DeleteOutlined
                className="action-icon  red-text"
                onClick={() => this.onDeleteAdmin({ id: item.id })}
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
      this.updateAdminsList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateAdminsList(this.state.meta.pageSize, (page - 1) * this.state.meta.pageSize);
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    const { admins } = this.props.adminStore!;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.adminStore!.totalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    return (
      <Card
        title={
          <div>
            <span>{L('Admins')}</span>
            {this.state.permisssionsGranted.create && (
              <Button
                type="primary"
                style={{ float: localization.getFloat() }}
                icon={<PlusOutlined />}
                onClick={() => this.openAdminModal({ id: 0 })}
              >
                {L('AddAdmin')}
              </Button>
            )}
            {!this.props.adminStore!.loadingAdminsForExport && (
              <a
                download="admins.xlsx"
                className="ant-btn ant-btn-default export-btn"
                style={{ float: localization.getFloat(), margin: '0 5px' }}
                id="export"
                href="#"
                onClick={() => {
                  return ExcellentExport.convert(
                    {
                      anchor: document.getElementById('export') as HTMLAnchorElement,
                      filename: L('Admins'),
                      format: 'xlsx',
                    },
                    [
                      {
                        name: L('Admins'),
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
        <table id="datatable" style={{ display: 'none' }}>
          <thead>
            <tr>
              <td>{L('ID')}</td>
              <td>{L('Name')}</td>
              <td>{L('Email')}</td>
              <td>{L('LastLoginTime')}</td>
              <td>{L('Status')}</td>
              <td>{L('CreationDate')}</td>
            </tr>
          </thead>
          <tbody>
            {this.props.adminStore!.AdminsForExport.length > 0 &&
              this.props.adminStore!.AdminsForExport.map((admin: AdminDto, index: number) => {
                return (
                  <tr key={index}>
                    <td>{admin.id}</td>
                    <td>{admin.fullName}</td>
                    <td>{admin.emailAddress}</td>
                    <td>
                      {admin.lastLoginTime
                        ? moment(admin.lastLoginTime).format(timingHelper.defaultDateTimeFormat)
                        : L('NotAvailable')}
                    </td>
                    <td>
                      {admin.status === UserStatus.Inactive
                        ? L('Inactive')
                        : admin.status === UserStatus.Active
                        ? L('Active')
                        : L('Blocked')}
                    </td>
                    <td>{moment(admin.creationTime).format(timingHelper.defaultDateFormat)}</td>
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
                    isActiveFilter: value === 3 ? undefined : value === 1,
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
                await this.updateAdminsList(this.state.meta.pageSize, this.state.meta.skipCount);
              }}
              style={{ width: 90 }}
            >
              {L('Filter')}
            </Button>
            <Button
              onClick={() => {
                this.setState({ isActiveFilter: undefined }, async () => {
                  await this.updateAdminsList(this.state.meta.pageSize, this.state.meta.skipCount);
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
          rowKey={(record) => `${record.id}`}
          style={{ marginTop: '12px' }}
          loading={this.props.adminStore!.loadingAdmins}
          dataSource={admins === undefined ? [] : admins}
          columns={this.adminsTableColumns}
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
                  <b> {L('Email')}: </b>
                  {record.emailAddress}
                </span>
                <span>
                  <b> {L('CreationDate')}: </b>
                  {moment(record.creationTime).format(timingHelper.defaultDateFormat)}
                </span>
              </p>
            ),
            rowExpandable: (record) => true,
          }}
        />

        <CreateOrUpdateAdmin
          formRef={this.formRef}
          visible={this.state.adminModalVisible}
          onCancel={() =>
            this.setState({
              adminModalVisible: false,
            })
          }
          adminsModalId={this.state.adminsModalId}
          modalType={this.state.adminsModalType}
          isSubmittingAdmin={this.props.adminStore!.isSubmittingAdmin}
          adminStore={this.props.adminStore}
        />

        <AdminDetailsModal
          visible={this.state.adminDetailsModalVisible}
          onCancel={() =>
            this.setState({
              adminDetailsModalVisible: false,
            })
          }
          treeData={this.state.treeData}
          adminStore={this.props.adminStore}
        />

        <ResetPasswordModal
          formRef={this.resetPasswordFormRef}
          isOpen={this.state.resetPasswordModalVisible}
          userId={this.state.adminId}
          onClose={() =>
            this.setState({
              resetPasswordModalVisible: false,
            })
          }
        />
      </Card>
    );
  }
}

export default Admins;
