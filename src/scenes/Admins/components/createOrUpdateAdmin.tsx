/* eslint-disable */
import * as React from 'react';
import { Form, Modal, Button, Input, Tree, Tabs } from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import FormItem from 'antd/lib/form/FormItem';
import localization from '../../../lib/localization';
import AdminStore from '../../../stores/adminStore';
import RoleStore from '../../../stores/roleStore';
import { FormInstance } from 'antd/lib/form';
import { GetAllPermissionsOutput } from '../../../services/role/dto/getAllPermissionsOutput';
import { DeploymentUnitOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { CreateAdminDto } from '../../../services/admins/dto/createAdminDto';
import { UpdateAdminDto } from '../../../services/admins/dto/updateAdminDto';

const { TabPane } = Tabs;

export interface ICreateOrUpdateAdminProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  adminStore?: AdminStore;
  adminsModalId: number;
  roleStore?: RoleStore;
  isSubmittingAdmin: boolean;
  formRef: React.RefObject<FormInstance>;
}
export interface ICreateOrUpdateAdminState {
  email: { value: string; validateStatus: string | undefined; errorMsg: string | null };
  permissionKeys: Array<string>;
  oldPermissionKeys: Array<string>;
  finalPermissionKeys: Array<string>;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 },
    md: { span: 6 },
    lg: { span: 6 },
    xl: { span: 6 },
    xxl: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 18 },
    sm: { span: 18 },
    md: { span: 18 },
    lg: { span: 18 },
    xl: { span: 18 },
    xxl: { span: 18 },
  },
};

@inject(Stores.AdminStore, Stores.RoleStore)
@observer
class CreateOrUpdateAdmin extends React.Component<
  ICreateOrUpdateAdminProps,
  ICreateOrUpdateAdminState
> {
  checkboxes: any[] = [];
  permissionKeys: string[] = [];
  oldPermissionKeys: string[] = [];
  allPermissionKeys: string[] = [];
  treeData: any[] = [];

  async componentDidMount() {
    await this.props.roleStore!.getAllPermissions();
    const { allPermissions } = this.props.roleStore!;
    let userChildrens: any[] = [];
    let newsChildrens: any[] = [];
    let shopsChildrens: any[] = [];
    let productsChildrens: any[] = [];
    let eventsChildrens: any[] = [];
    let myLifeChildrens: any[] = [];
    let personalityChildrens: any[] = [];
    let childrens: any[] = [];
    allPermissions.map((x: GetAllPermissionsOutput, index: number) => {
      if (
        x.name === 'Admins' ||
        x.name === 'Clients' ||
        x.name === 'ShopManagers' ||
        x.name === 'EventOrganizers' ||
        x.name === 'NewsCategories' ||
        x.name === 'EventCategories' ||
        x.name === 'Quotes' ||
        x.name === 'Stories' ||
        x.name === 'Colors' ||
        x.name === 'Sizes' ||
        x.name === 'Categories' ||
        x.name === 'Coupons' ||
        x.name === 'SliderImages' ||
        x.name === 'Orders' ||
        x.name === 'Classifications' ||
        x.name === 'Products' ||
        x.name === 'Avatars' ||
        x.name === 'Questions'
      ) {
        if (
          x.name === 'Admins' ||
          x.name === 'Clients' ||
          x.name === 'ShopManagers' ||
          x.name === 'EventOrganizers'
        ) {
          // users permisions
          if (x.children.length > 0) {
            childrens = [];
            for (let i = 0; i < x.children.length; i++) {
              childrens.push({ title: L(x.children[i].name), key: x.children[i].key });
            }
            userChildrens.push({ title: L(x.name), key: x.key, children: childrens });
          } else {
            userChildrens.push({ title: L(x.name), key: x.key });
          }
        } else if (x.name === 'NewsCategories') {
          // news permisions
          if (x.children.length > 0) {
            childrens = [];
            for (let i = 0; i < x.children.length; i++) {
              childrens.push({ title: L(x.children[i].name), key: x.children[i].key });
            }
            newsChildrens.push({ title: L(x.name), key: x.key, children: childrens });
          } else {
            newsChildrens.push({ title: L(x.name), key: x.key });
          }
        } else if (x.name === 'EventCategories') {
          // events permisions
          if (x.children.length > 0) {
            childrens = [];
            for (let i = 0; i < x.children.length; i++) {
              childrens.push({ title: L(x.children[i].name), key: x.children[i].key });
            }
            eventsChildrens.push({ title: L(x.name), key: x.key, children: childrens });
          } else {
            eventsChildrens.push({ title: L(x.name), key: x.key });
          }
        } else if (x.name === 'Colors' || x.name === 'Sizes') {
          // products permisions
          if (x.children.length > 0) {
            childrens = [];
            for (let i = 0; i < x.children.length; i++) {
              childrens.push({ title: L(x.children[i].name), key: x.children[i].key });
            }
            productsChildrens.push({ title: L(x.name), key: x.key, children: childrens });
          } else {
            productsChildrens.push({ title: L(x.name), key: x.key });
          }
        } else if (
          x.name === 'Categories' ||
          x.name === 'Coupons' ||
          x.name === 'SliderImages' ||
          x.name === 'Orders' ||
          x.name === 'Classifications' ||
          x.name === 'Products'
        ) {
          // shops permisions
          if (x.children.length > 0) {
            childrens = [];
            for (let i = 0; i < x.children.length; i++) {
              childrens.push({ title: L(x.children[i].name), key: x.children[i].key });
            }
            shopsChildrens.push({ title: L(x.name), key: x.key, children: childrens });
          } else {
            shopsChildrens.push({ title: L(x.name), key: x.key });
          }
        } else if (x.name === 'Avatars' || x.name === 'Questions') {
          // personality permisions
          if (x.children.length > 0) {
            childrens = [];
            for (let i = 0; i < x.children.length; i++) {
              childrens.push({ title: L(x.children[i].name), key: x.children[i].key });
            }
            personalityChildrens.push({ title: L(x.name), key: x.key, children: childrens });
          } else {
            personalityChildrens.push({ title: L(x.name), key: x.key });
          }
        } else if (x.name === 'Quotes' || x.name === 'Stories') {
          // my life permisions
          if (x.children.length > 0) {
            childrens = [];
            for (let i = 0; i < x.children.length; i++) {
              childrens.push({ title: L(x.children[i].name), key: x.children[i].key });
            }
            myLifeChildrens.push({ title: L(x.name), key: x.key, children: childrens });
          } else {
            myLifeChildrens.push({ title: L(x.name), key: x.key });
          }
        }
      } else {
        this.allPermissionKeys.push(x.key);
        if (x.children.length > 0) {
          childrens = [];
          for (let i = 0; i < x.children.length; i++) {
            childrens.push({ title: L(x.children[i].name), key: x.children[i].key });
            this.allPermissionKeys.push(x.children[i].key);
          }
          this.treeData.push({ title: L(x.name.trim()), key: x.key, children: childrens });
        } else {
          this.treeData.push({ title: L(x.name.trim()), key: x.key });
        }
      }

      return this.treeData;
    });
    let usersIndex = this.treeData.findIndex((item) => item.title === L('Users'));
    this.treeData[usersIndex] = {
      ...this.treeData[usersIndex],
      children: [...this.treeData[usersIndex].children, ...userChildrens],
    };
    let newsIndex = this.treeData.findIndex((item) => item.title === L('News'));
    this.treeData[newsIndex] = {
      ...this.treeData[newsIndex],
      children: [...this.treeData[newsIndex].children, ...newsChildrens],
    };
    let eventsIndex = this.treeData.findIndex((item) => item.title === L('Events'));
    this.treeData[eventsIndex] = {
      ...this.treeData[eventsIndex],
      children: [...this.treeData[eventsIndex].children, ...eventsChildrens],
    };
    let personalityIndex = this.treeData.findIndex((item) => item.title === L('Personality'));
    this.treeData[personalityIndex] = {
      ...this.treeData[personalityIndex],
      children: [...this.treeData[personalityIndex].children, ...personalityChildrens],
    };
    let myLifeIndex = this.treeData.findIndex((item) => item.title === L('MyLife'));
    this.treeData[myLifeIndex] = {
      ...this.treeData[myLifeIndex],
      children: [...this.treeData[myLifeIndex].children, ...myLifeChildrens],
    };
    let shopsIndex = this.treeData.findIndex((item) => item.title === L('Shops'));
    this.treeData[shopsIndex] = {
      ...this.treeData[shopsIndex],
      children: [...this.treeData[shopsIndex].children, ...shopsChildrens],
    };
    let productsIndex = this.treeData[shopsIndex].children.findIndex(
      (item: any) => item.title === L('Products')
    );
    this.treeData[shopsIndex].children[productsIndex] = {
      ...this.treeData[shopsIndex].children[productsIndex],
      children: [
        ...this.treeData[shopsIndex].children[productsIndex].children,
        ...productsChildrens,
      ],
    };
  }

  componentDidUpdate() {
    const { adminModel } = this.props.adminStore!;
    if (adminModel !== undefined && this.state.email.value !== adminModel.emailAddress) {
      this.onEmailChange({ target: { value: adminModel.emailAddress } });
    }

    if (
      adminModel !== undefined &&
      this.allPermissionKeys.length > 0 &&
      this.permissionKeys.length === 0 &&
      this.oldPermissionKeys.length === 0 &&
      this.props.modalType === 'edit'
    ) {
      adminModel.permissions!.map((x: GetAllPermissionsOutput) => {
        this.oldPermissionKeys.push(x.key);
        if (x.children.length > 0) {
          for (let i = 0; i < x.children.length; i++) this.permissionKeys.push(x.children[i].key);
        }
        this.setState({
          permissionKeys: this.permissionKeys,
          oldPermissionKeys: this.oldPermissionKeys,
        });
        return this.permissionKeys;
      });
    }

    if (
      adminModel === undefined &&
      this.props.modalType === 'create' &&
      this.permissionKeys.length > 0
    ) {
      this.permissionKeys = [];
      this.oldPermissionKeys = [];
      this.setState({ permissionKeys: [] });
    }
  }

  state = {
    email: { value: '', validateStatus: undefined, errorMsg: null },
    permissionKeys: [''],
    oldPermissionKeys: [],
    finalPermissionKeys: [],
  };

  handleSubmit = async () => {
    const form = this.props.formRef.current;
    form!.validateFields().then(async (values: any) => {
      values.permissionKeys = this.state.finalPermissionKeys;

      if (this.props.adminsModalId === 0) {
        await this.props.adminStore!.createAdmin(values as CreateAdminDto);
      } else {
        values.id = this.props.adminsModalId;
        await this.props.adminStore!.updateAdmin(values as UpdateAdminDto);
      }
      await this.props.adminStore!.getAdmins();
      this.props.onCancel();
      window.location.reload();
      form!.resetFields();
    });
  };

  handleCancel = () => {
    this.props.onCancel();
  };

  validateEmail = (value: string) => {
    let reqex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (value !== '' && !reqex.test(value)) {
      return {
        validateStatus: 'error',
        errorMsg: L('ThisEmailIsInvalid'),
      };
    }
    if (value !== '') {
      return {
        validateStatus: 'success',
        errorMsg: null,
      };
    }

    return {
      validateStatus: 'error',
      errorMsg: L('ThisFieldIsRequired'),
    };
  };

  onEmailChange = (e: any) => {
    let value = e.target.value;
    this.setState({ email: { ...this.validateEmail(value), value } });
  };

  render() {
    const { visible, onCancel, modalType } = this.props;
    const { adminModel } = this.props.adminStore!;

    return (
      <Modal
        visible={visible}
        title={modalType === 'create' ? L('CreateAdmin') : L('EditAdmin')}
        onCancel={onCancel}
        centered
        destroyOnClose
        width={'80%'}
        className={localization.isRTL() ? 'rtl-modal admin-modal' : 'ltr-modal admin-modal'}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Cancel')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={this.props.isSubmittingAdmin}
            onClick={this.handleSubmit}
          >
            {modalType === 'create' ? L('Create') : L('Save')}
          </Button>,
        ]}
      >
        <div className="scrollable-modal">
          <Form ref={this.props.formRef}>
            <Tabs defaultActiveKey="1">
              <TabPane
                tab={
                  <span>
                    <InfoCircleOutlined />
                    {L('General')}
                  </span>
                }
                key="1"
              >
                <>
                  <FormItem
                    label={L('FirstName')}
                    name="name"
                    {...formItemLayout}
                    rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                    initialValue={adminModel !== undefined ? adminModel.name : undefined}
                  >
                    <Input />
                  </FormItem>
                  <FormItem
                    label={L('Surname')}
                    name="surname"
                    {...formItemLayout}
                    rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                    initialValue={adminModel !== undefined ? adminModel.surname : undefined}
                  >
                    <Input />
                  </FormItem>
                  <FormItem
                    label={L('Email')}
                    name="emailAddress"
                    {...formItemLayout}
                    initialValue={adminModel !== undefined ? adminModel.emailAddress : undefined}
                    validateStatus={this.state.email.validateStatus}
                    rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                    help={this.state.email.errorMsg}
                  >
                    <Input type="text" onLoad={this.onEmailChange} onChange={this.onEmailChange} />
                  </FormItem>
                  {modalType === 'create' && (
                    <>
                      <Form.Item
                        name={'password'}
                        label={L('Password')}
                        {...formItemLayout}
                        rules={[
                          { required: true, message: L('ThisFieldIsRequired') },
                          {
                            pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                            message: L('passwordValidation'),
                          },
                        ]}
                      >
                        <Input.Password
                          type="password"
                          visibilityToggle={true}
                          autoComplete="off"
                        />
                      </Form.Item>
                      <Form.Item
                        label={L('ConfirmPassword')}
                        dependencies={['password']}
                        name="confirmPassword"
                        {...formItemLayout}
                        rules={[
                          { required: true, message: L('ThisFieldIsRequired') },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                new Error(L('TheTwoPasswordsThatYouEnteredDoNotMatch'))
                              );
                            },
                          }),
                        ]}
                      >
                        <Input.Password visibilityToggle />
                      </Form.Item>
                    </>
                  )}
                </>
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <DeploymentUnitOutlined />
                    {L('Permissions')}
                  </span>
                }
                key="2"
              >
                <FormItem
                  name="permissionKeys"
                  initialValue={adminModel !== undefined ? this.state.permissionKeys : []}
                  {...formItemLayout}
                >
                  {this.treeData.length > 0 && (
                    <Tree
                      checkable
                      onCheck={(item: any) => {
                        let newItems: Array<string> = [];
                        let finalItems: Array<string> = [];

                        newItems = item.filter((i: string) => i.indexOf('-') > -1);

                        newItems.map((item: string) => {
                          if (!newItems.includes(item.substring(0, item.indexOf('-')) + '-0')) {
                            newItems.push(item.substring(0, item.indexOf('-')) + '-0');
                          }

                          return newItems;
                        });

                        this.setState({ permissionKeys: newItems });

                        newItems = newItems.sort();

                        finalItems = newItems.filter((i: string) => i.indexOf('-') > -1);

                        finalItems.map((item: string) => {
                          if (!finalItems.includes(item.substring(0, item.indexOf('-')))) {
                            finalItems.push(item.substring(0, item.indexOf('-')));
                          }
                          return finalItems;
                        });
                        this.setState({ finalPermissionKeys: finalItems });
                      }}
                      selectable
                      selectedKeys={this.state.oldPermissionKeys}
                      checkedKeys={this.state.permissionKeys}
                      treeData={this.treeData}
                    />
                  )}
                </FormItem>
              </TabPane>
            </Tabs>
          </Form>
        </div>
      </Modal>
    );
  }
}

export default CreateOrUpdateAdmin;
