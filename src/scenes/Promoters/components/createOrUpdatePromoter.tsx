/* eslint-disable */
import * as React from 'react';
import { Form, Modal, Button, Input, Select ,DatePicker,Col,Row} from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import FormItem from 'antd/lib/form/FormItem';
import localization from '../../../lib/localization';
import { FormInstance } from 'antd/lib/form';
import { LiteEntityDto } from '../../../services/locations/dto/liteEntityDto';
import shopsService from '../../../services/shops/shopsService';
import PromoterStore from '../../../stores/promoterStore';
import EditableImage from '../../../components/EditableImage';
import moment from 'moment';
import timingHelper from '../../../lib/timingHelper';
import './createOrUpdatePromoter.css';
import { ImageAttr } from '../../../services/dto/imageAttr';
export interface ICreateOrUpdatePromoterProps{
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  promoterStore?: PromoterStore;
  onOk: () => void;
  isSubmittingPromoter: boolean;
  formRef:React.RefObject<FormInstance>;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 },
    md: { span: 6 },
    lg: { span: 8 },
    xl: { span: 8 },
    xxl: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 18 },
    sm: { span: 18 },
    md: { span: 18 },
    lg: { span: 14 },
    xl: { span: 14 },
    xxl: { span: 14 },
  },
};

const colLayout = {

  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 },
  xxl: { span: 12 },

};

export interface ICreateOrUpdatePromoterState{
  defaultDrivingLicenseImage:Array<ImageAttr>;
  defaultIdentityImage:Array<ImageAttr>;
  defaultPassportImage:Array<ImageAttr>;
  defaultVehicleImage:Array<ImageAttr>;
}
@inject(Stores.PromoterStore)
@observer
class CreateOrUpdatePromoter extends React.Component<ICreateOrUpdatePromoterProps, ICreateOrUpdatePromoterState> {

  shops:LiteEntityDto[]=[];

  state={
    defaultDrivingLicenseImage:[],
    defaultIdentityImage:[],
    defaultPassportImage:[],
    defaultVehicleImage:[]
  };
 
  async componentDidMount(){
    let result = await shopsService.getAllLite();
    this.shops = result.items;
  }

  componentDidUpdate(){
    const {promoterModel} = this.props.promoterStore!;
    
    if(this.state.defaultDrivingLicenseImage.length ===0 && promoterModel!== undefined&&  promoterModel.drivingLicenseUrl !==null){      
        this.setState({defaultDrivingLicenseImage: [{
          uid: 1,
          name: `drivingLicenseImage.png`,
          status: 'done',
          url: promoterModel.drivingLicenseUrl,
          thumbUrl: promoterModel.drivingLicenseUrl,
        }]});
    }
    if(promoterModel === undefined && this.state.defaultDrivingLicenseImage.length>0){
      this.setState({defaultDrivingLicenseImage:[]});
    }
    if(promoterModel !== undefined && promoterModel.drivingLicenseUrl !==null && this.state.defaultDrivingLicenseImage.length >0&& this.state.defaultDrivingLicenseImage[0]["url"] !== promoterModel.drivingLicenseUrl){
      this.setState({defaultDrivingLicenseImage:[]});
    }
   
  if(this.state.defaultIdentityImage.length ===0 && promoterModel!== undefined&&  promoterModel.identityUrl !==null){      
      this.setState({defaultIdentityImage: [{
        uid: 1,
        name: `identityImage.png`,
        status: 'done',
        url: promoterModel.identityUrl,
        thumbUrl: promoterModel.identityUrl,
      }]});
  }
  if(promoterModel === undefined && this.state.defaultIdentityImage.length>0){
    this.setState({defaultIdentityImage:[]});
  }
  if(promoterModel !== undefined && promoterModel.identityUrl !==null && this.state.defaultIdentityImage.length >0&& this.state.defaultIdentityImage[0]["url"] !== promoterModel.identityUrl){
    this.setState({defaultIdentityImage:[]});
  }

if(this.state.defaultPassportImage.length ===0 && promoterModel!== undefined&&  promoterModel.passportUrl !==null){      
    this.setState({defaultPassportImage: [{
      uid: 1,
      name: `passportImage.png`,
      status: 'done',
      url: promoterModel.passportUrl,
      thumbUrl: promoterModel.passportUrl,
    }]});
}
if(promoterModel === undefined && this.state.defaultPassportImage.length>0){
  this.setState({defaultPassportImage:[]});
}
if(promoterModel !== undefined && promoterModel.passportUrl !==null && this.state.defaultPassportImage.length >0&& this.state.defaultPassportImage[0]["url"] !== promoterModel.passportUrl){
  this.setState({defaultPassportImage:[]});
}


if(this.state.defaultVehicleImage.length ===0 && promoterModel!== undefined&&  promoterModel.vehicleImageUrl !==null){      
  this.setState({defaultVehicleImage: [{
    uid: 1,
    name: `vehicleImage.png`,
    status: 'done',
    url: promoterModel.vehicleImageUrl,
    thumbUrl: promoterModel.vehicleImageUrl,
  }]});
}
if(promoterModel === undefined && this.state.defaultVehicleImage.length>0){
this.setState({defaultVehicleImage:[]});
}
if(promoterModel !== undefined && promoterModel.vehicleImageUrl !==null && this.state.defaultVehicleImage.length >0&& this.state.defaultVehicleImage[0]["url"] !== promoterModel.vehicleImageUrl){
this.setState({defaultVehicleImage:[]});
}


  }


  handleSubmit = async () => {
    await this.props.onOk();
  }

  handleCancel = () => {
    this.props.onCancel();
  }
  
  render() {
   
    const { visible, onCancel, modalType } = this.props;
    const { promoterModel } = this.props.promoterStore!;
   
    if (this.props.visible === false && document.getElementById('vehicle-image') != null)
      document.getElementById('vehicle-image')!.setAttribute('value', '');

      if (this.props.visible === false && document.getElementById('drivingLicense-image') != null)
      document.getElementById('drivingLicense-image')!.setAttribute('value', '');

      if (this.props.visible === false && document.getElementById('passport-image') != null)
      document.getElementById('passport-image')!.setAttribute('value', '');

      if (this.props.visible === false && document.getElementById('identity-image') != null)
      document.getElementById('identity-image')!.setAttribute('value', '');

    return (
      <Modal
        visible={visible}
        title={modalType === 'create' ? L('CreatePromoter') : L('EditPromoter')}
        onCancel={onCancel}
        centered
        destroyOnClose
        width={"80%"}
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Cancel')}
          </Button>,
          <Button key="submit" type="primary" loading={this.props.isSubmittingPromoter} onClick={this.handleSubmit}>
            {modalType === 'create' ? L('Create') : L('Save')}
          </Button>,
        ]}
      >
        <Form ref={this.props.formRef}>
        
            <Row className="create-promoter-body">
              <Col {...colLayout}>
              <FormItem label={L('Name')} name="fullName" {...formItemLayout}
              rules={ [{ required: true, message: L('ThisFieldIsRequired') }] }
              initialValue={promoterModel !== undefined ? promoterModel.fullName : undefined}
              >
                  <Input /> 
              </FormItem>
              </Col>
              <Col {...colLayout}>
              <FormItem label={L('PhoneNumber')} name="phoneNumber" {...formItemLayout}
              initialValue={promoterModel !== undefined ? promoterModel.phoneNumber : undefined}
                rules ={[{ required: true, message: L('ThisFieldIsRequired') }]}
              >
                  <Input type="PhoneNumber" />
              </FormItem>
                     </Col>
                     
         
              
              <Col {...colLayout}>
              <FormItem       
                label={ L('Shop')}
                {...formItemLayout}
                initialValue={promoterModel !== undefined ? promoterModel.shop?.value : undefined}
                
                name="shopId"
              >
                <Select
                  placeholder={L('PleaseSelectShop')}  
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option:any) =>
                    option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  >
                  {this.shops.length>0 && this.shops.map((element:LiteEntityDto) => <Select.Option key={element.value} value={element.value}>{element.text}</Select.Option>)}
                </Select>
              </FormItem>
              </Col>
              <Col {...colLayout}>
          <FormItem label={L('ResidenceExpirationDate')} 
              name="residenceExpirationDate"
           initialValue={ promoterModel !== undefined && promoterModel.residenceExpirationDate ? moment(promoterModel.residenceExpirationDate) : undefined}
            {...formItemLayout}
          >
          
<DatePicker 
placeholder={L('SelectDate')}

                      format={timingHelper.defaultDateFormat}
                    />
           
          </FormItem>
          </Col>
  
              <Col {...colLayout}> 
              <FormItem label={L('Identity')} 
          required
          
          {...formItemLayout}
>
          <img id='identity-image' style={{display:'none'}}/>
          <EditableImage
          
              defaultFileList={promoterModel!== undefined && promoterModel.identityUrl!==null ? this.state.defaultIdentityImage:[]}
              onSuccess={fileName => {
     document.getElementById('identity-image')!.setAttribute("value", fileName);
     }}
              
          />
</FormItem>
            
          </Col>
          <Col {...colLayout}>
          <FormItem label={L('Passport')} 
                   
          {...formItemLayout}
>
          <img id='passport-image' style={{display:'none'}}/>
          <EditableImage
          
           
              defaultFileList={promoterModel!== undefined && promoterModel.passportUrl!==null ? this.state.defaultPassportImage:[]}
              onSuccess={fileName => {
     document.getElementById('passport-image')!.setAttribute("value", fileName);
     }}
            
          />
</FormItem>
       
         </Col>
        
          <Col {...colLayout}>
          <FormItem       
                label={ L('LicenseType')}
                {...formItemLayout}
                initialValue={promoterModel !== undefined ? promoterModel.licenseType : undefined}
                
                name="licenseType"
              >
                <Select
                  placeholder={L('PleaseSelectLicenseType')}  
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option:any) =>
                    option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  >
                    <Select.Option key={0} value={0}>{L("A")}</Select.Option>
                    <Select.Option key={1} value={1}>{L("B")}</Select.Option>
                    <Select.Option key={2} value={2}>{L("C")}</Select.Option>
                    <Select.Option key={3} value={3}>{L("D")}</Select.Option>
                </Select>
              </FormItem>
</Col>
      
         
        
          <Col {...colLayout}>
          <FormItem label={L('VehicleName')} name="vehicleName" {...formItemLayout}
              rules={ [{ required: true, message: L('ThisFieldIsRequired') }] }
              initialValue={promoterModel !== undefined ? promoterModel.vehicleName : undefined}
              >
                  <Input /> 
              </FormItem>
              </Col>
              <Col {...colLayout}>
              <FormItem label={L('VehicleNumber')} name="vehicleNumber" {...formItemLayout}
              rules={ [{ required: true, message: L('ThisFieldIsRequired') }] }
              initialValue={promoterModel !== undefined ? promoterModel.vehicleNumber : undefined}
              >
                  <Input /> 
              </FormItem>
          </Col>
          <Col {...colLayout}>
              <FormItem       
                label={ L('VehicleType')}
                {...formItemLayout}
                initialValue={promoterModel !== undefined ? promoterModel.vehicleType : undefined}                
                name="vehicleType"
              >
                <Select
                  placeholder={L('PleaseSelectVehicleType')}  
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option:any) =>
                    option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  >
                    <Select.Option key={0} value={0}>{L("Car")}</Select.Option>
                    <Select.Option key={1} value={1}>{L("Motorcycle")}</Select.Option>
                    <Select.Option key={2} value={2}>{L("Bicycle")}</Select.Option>
                    <Select.Option key={3} value={3}>{L("Van")}</Select.Option>
                    <Select.Option key={4} value={4}>{L("Truck")}</Select.Option>
                    <Select.Option key={5} value={5}>{L("Bus")}</Select.Option>
               
                </Select>
              </FormItem>
</Col>
<Col {...colLayout}>
<FormItem label={L('DrivingLicense')} 
                   required
                   {...formItemLayout}
         >
                   <img id='drivingLicense-image' style={{display:'none'}}/>
                   <EditableImage
                    defaultFileList={promoterModel!== undefined && promoterModel.drivingLicenseUrl!==null ? this.state.defaultDrivingLicenseImage:[]}
                    onSuccess={fileName => {
           document.getElementById('drivingLicense-image')!.setAttribute("value", fileName);
           }}
                    
                   />
         </FormItem>
             
          </Col>
          
<Col {...colLayout}>
<FormItem label={L('VehicleImage')} 
                   
                   {...formItemLayout}
         >
                   <img id='vehicle-image' style={{display:'none'}}/>
                   <EditableImage
                    defaultFileList={promoterModel!== undefined && promoterModel.vehicleImageUrl!==null ? this.state.defaultVehicleImage:[]}
                    onSuccess={fileName => {
           document.getElementById('vehicle-image')!.setAttribute("value", fileName);
           }}
               
                   />
         </FormItem>
           
          </Col>
          
          {modalType ==='create' && (
              <Col {...colLayout}>
                <Form.Item name={'password'} label={L('Password')}  {...formItemLayout}
                rules= {[{ required: true, message: L('ThisFieldIsRequired') }]}
              >
                <Input.Password visibilityToggle type="password" />
              </Form.Item>
              </Col>
              ) }
          </Row>
         
        </Form>
      </Modal>
    );
  }
}

export default CreateOrUpdatePromoter;
