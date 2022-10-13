/* eslint-disable */

import * as React from 'react';
import { Form, Modal, Button, Input, Col, Row, Select, DatePicker } from 'antd';
import { inject, observer } from 'mobx-react';
import FormItem from 'antd/lib/form/FormItem';
import { FormInstance } from 'antd/lib/form';
import { CKEditor } from 'ckeditor4-react';
import moment from 'moment';
import Stores from '../../../stores/storeIdentifier';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import EditableImage from '../../../components/EditableImage';
import NewsStore from '../../../stores/newsStore';
import { ImageAttr } from '../../../services/dto/imageAttr';
import { LiteEntityDto } from '../../../services/locations/dto/liteEntityDto';
import { NewsCategoryDto } from '../../../services/newsCategory/dto/newsCategoryDto';

const { Option } = Select;

export interface ICreateOrUpdateNewsProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  newsStore?: NewsStore;
  onOk: (editors: any) => void;
  isSubmittingNews: boolean;
  formRef: React.RefObject<FormInstance>;
  cities: LiteEntityDto[];
  newsCategories: NewsCategoryDto[];
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
    lg: { span: 16 },
    xl: { span: 16 },
    xxl: { span: 16 },
  },
};

const colLayout = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 24 },
  xl: { span: 24 },
  xxl: { span: 24 },
};

const config = {
  format_tags: 'p;h1;h2;h3;h4;h5;h6',
};

export interface ICreateOrUpdateNewsState {
  defaultImage: Array<ImageAttr>;
  arTitle: { value: string; validateStatus?: string; errorMsg: string | null };
  enTitle: { value: string; validateStatus?: string; errorMsg: string | null };
  arDescription: { value: string; validateStatus?: string; errorMsg: string | null };
  enDescription: { value: string; validateStatus?: string; errorMsg: string | null };
  tags: Array<string>;
}

@inject(Stores.NewsStore)
@observer
class CreateOrUpdateNews extends React.Component<
  ICreateOrUpdateNewsProps,
  ICreateOrUpdateNewsState
> {
  formRef = React.createRef<FormInstance>();

  arDescriptionEditor = null;

  enDescriptionEditor = null;

  state = {
    arTitle: { value: '', validateStatus: undefined, errorMsg: null },
    enTitle: { value: '', validateStatus: undefined, errorMsg: null },
    arDescription: { value: '', validateStatus: undefined, errorMsg: null },
    enDescription: { value: '', validateStatus: undefined, errorMsg: null },
    defaultImage: [],
    tags: [],
  };

  componentDidUpdate() {
    const { newsModel } = this.props.newsStore!;

    if (
      this.state.defaultImage.length === 0 &&
      newsModel !== undefined &&
      newsModel.sourceLogo !== null
    ) {
      this.setState({
        defaultImage: [
          {
            uid: 1,
            name: `newsImage.png`,
            status: 'done',
            url: newsModel.sourceLogo,
            thumbUrl: newsModel.sourceLogo,
          },
        ],
      });
    }

    if (newsModel === undefined && this.state.defaultImage.length > 0) {
      this.setState({ defaultImage: [] });
    }
    if (
      newsModel !== undefined &&
      newsModel.sourceLogo !== null &&
      this.state.defaultImage.length > 0 &&
      this.state.defaultImage[0]['url'] !== newsModel.sourceLogo
    ) {
      this.setState({ defaultImage: [] });
    }
  }

  validatearTitle = (value: string) => {
    const reqex = /^[\u0600-\u06FF0-9\s.\-_()+]+$/;
    if (value !== '' && !reqex.test(value)) {
      return {
        validateStatus: 'warning',
        errorMsg: L('YouAreWritingEnglishSymbols'),
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

  validateenTitle = (value: string) => {
    const reqex = /^[A-Za-z0-9\s.\-_()+]+$/;
    if (value !== '' && !reqex.test(value)) {
      return {
        validateStatus: 'warning',
        errorMsg: L('YouAreWritingArabicSymbols'),
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

  onArChange = (e: any) => {
    const { value } = e.target;
    this.setState({ arTitle: { ...this.validatearTitle(value), value } });
  };

  onEnChange = (e: any) => {
    const { value } = e.target;
    this.setState({ enTitle: { ...this.validateenTitle(value), value } });
  };

  onArDescriptionChange = (value: any) => {
    // let value = e.target.value;
    this.setState({ arDescription: { validateStatus: undefined, errorMsg: null, value } });
  };

  onEnDescriptionChange = (value: any) => {
    // let value = e.target.value;
    this.setState({ enDescription: { validateStatus: undefined, errorMsg: null, value } });
  };

  handleSubmit = async (editors: any) => {
    await this.props.onOk(editors);
  };

  handleCancel = () => {
    this.props.onCancel();
  };

  render() {
    const { visible, modalType } = this.props;
    const { newsModel } = this.props.newsStore!;

    if (this.props.visible === false && document.getElementById('news-image') != null) {
      document.getElementById('news-image')!.setAttribute('value', '');
    }

    return (
      <Modal
        width="70%"
        visible={visible}
        title={modalType === 'create' ? L('CreateNews') : L('EditNews')}
        onCancel={this.handleCancel}
        centered
        destroyOnClose
        maskClosable={false}
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Cancel')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={this.props.isSubmittingNews}
            onClick={() =>
              this.handleSubmit({
                arEditor: this.arDescriptionEditor,
                enEditor: this.enDescriptionEditor,
              })
            }
          >
            {modalType === 'create' ? L('Create') : L('Edit')}
          </Button>,
        ]}
      >
        <div className="scrollable-modal">
          <Form ref={this.props.formRef}>
            <Row>
              <Col {...colLayout}>
                <FormItem
                  label={L('ArName')}
                  initialValue={
                    newsModel !== undefined && newsModel.arTitle ? newsModel.arTitle : undefined
                  }
                  name="arTitle"
                  colon={false}
                  rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                  validateStatus={this.state.arTitle.validateStatus}
                  help={this.state.arTitle.errorMsg}
                  {...formItemLayout}
                >
                  <Input type="text" onChange={this.onArChange} onLoad={this.onArChange} />
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem
                  label={L('EnName')}
                  name="enTitle"
                  {...formItemLayout}
                  initialValue={
                    newsModel !== undefined && newsModel.enTitle ? newsModel.enTitle : undefined
                  }
                  rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                  colon={false}
                  validateStatus={this.state.enTitle.validateStatus}
                  help={this.state.enTitle.errorMsg}
                >
                  <Input type="text" onChange={this.onEnChange} onLoad={this.onEnChange} />
                </FormItem>
              </Col>

              <Col {...colLayout}>
                <FormItem
                  label={L('NewsCategory')}
                  name="categoryId"
                  {...formItemLayout}
                  rules={[{ required: true }]}
                  colon={false}
                  initialValue={
                    newsModel !== undefined && newsModel.categoryId
                      ? newsModel.categoryId
                      : undefined
                  }
                >
                  <Select
                    placeholder={L('PleaseSelectCategory')}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option: any) =>
                      option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {this.props.newsCategories.map((cat) => (
                      <Option value={cat.id}>{cat.name}</Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>

              <Col {...colLayout}>
                <FormItem
                  label={L('Cities')}
                  name="cities"
                  {...formItemLayout}
                  initialValue={
                    newsModel !== undefined && newsModel.cities
                      ? newsModel.cities?.map((city: any) => city?.value)
                      : undefined
                  }
                  rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                  colon={false}
                  // validateStatus={this.state.enTitle.validateStatus}
                  // help={this.state.enTitle.errorMsg}
                >
                  <Select
                    mode="multiple"
                    placeholder={L('PleaseSelectCity')}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option: any) =>
                      option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {this.props.cities?.map((city) => (
                      <Option value={city.value}>{city.text}</Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>

              <Col {...colLayout}>
                <FormItem
                  label={L('FromDate')}
                  name="fromDate"
                  {...formItemLayout}
                  rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                  colon={false}
                  initialValue={newsModel?.fromDate ? moment(newsModel?.fromDate) : undefined}
                >
                  <DatePicker />
                </FormItem>
              </Col>

              <Col {...colLayout}>
                <FormItem
                  label={L('ToDate')}
                  name="toDate"
                  {...formItemLayout}
                  rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                  colon={false}
                  initialValue={newsModel?.toDate ? moment(newsModel?.toDate) : undefined}
                >
                  <DatePicker />
                </FormItem>
              </Col>

              <Col {...colLayout}>
                <FormItem
                  label={L('ArDescription')}
                  initialValue={
                    newsModel !== undefined && newsModel.arDescription
                      ? newsModel.arDescription
                      : undefined
                  }
                  name="arDescription"
                  colon={false}
                  rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                  validateStatus={this.state.arDescription.validateStatus}
                  help={this.state.arDescription.errorMsg}
                  {...formItemLayout}
                >
                  <CKEditor
                    onInstanceReady={({ editor }) => {
                      this.arDescriptionEditor = editor;
                    }}
                    config={config}
                    initData={
                      newsModel !== undefined && newsModel.arDescription
                        ? newsModel.arDescription
                        : undefined
                    }
                    onChange={(event) => {
                      this.onArDescriptionChange(event.editor.getData());
                    }}
                  />
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem
                  label={L('EnDescription')}
                  name="enDescription"
                  {...formItemLayout}
                  initialValue={
                    newsModel !== undefined && newsModel.enDescription
                      ? newsModel.enDescription
                      : undefined
                  }
                  rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                  colon={false}
                  validateStatus={this.state.enDescription.validateStatus}
                  help={this.state.enDescription.errorMsg}
                >
                  <CKEditor
                    onInstanceReady={({ editor }) => {
                      this.enDescriptionEditor = editor;
                    }}
                    config={config}
                    initData={
                      newsModel !== undefined && newsModel.enDescription
                        ? newsModel.enDescription
                        : undefined
                    }
                    onChange={(event) => {
                      this.onEnDescriptionChange(event.editor.getData());
                    }}
                  />
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem
                  label={L('EnSourceName')}
                  name="enSourceName"
                  {...formItemLayout}
                  initialValue={
                    newsModel !== undefined && newsModel.enSourceName
                      ? newsModel.enSourceName
                      : undefined
                  }
                  colon={false}
                >
                  <Input type="text" />
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem
                  label={L('ArSourceName')}
                  name="arSourceName"
                  {...formItemLayout}
                  initialValue={
                    newsModel !== undefined && newsModel.arSourceName
                      ? newsModel.arSourceName
                      : undefined
                  }
                  colon={false}
                >
                  <Input type="text" />
                </FormItem>
              </Col>

              <Col {...colLayout}>
                <FormItem
                  label={L('SourceLogo')}
                  name="sourceLogo"
                  initialValue={newsModel?.sourceLogo ? newsModel?.sourceLogo : undefined}
                  {...formItemLayout}
                >
                  <EditableImage
                    defaultFileList={
                      newsModel?.sourceLogo
                        ? [
                            {
                              uid: 1,
                              name: 'sourceLogo',
                              status: 'done',
                              url: newsModel?.sourceLogo,
                              thumbUrl: newsModel?.sourceLogo,
                            },
                          ]
                        : []
                    }
                    onSuccess={(url: string) =>
                      this.props.formRef.current?.setFieldsValue({ sourceLogo: url })
                    }
                    onRemove={() =>
                      this.props.formRef.current?.setFieldsValue({
                        sourceLogo: undefined,
                      })
                    }
                  />
                </FormItem>
              </Col>

              <Col {...colLayout}>
                <FormItem
                  label={L('Tags')}
                  name="tags"
                  {...formItemLayout}
                  initialValue={
                    newsModel !== undefined && newsModel.tags
                      ? newsModel.tags?.map((tag: any) => tag)
                      : undefined
                  }
                >
                  <Select mode="tags" />
                </FormItem>
              </Col>

              <Col {...colLayout}>
                <FormItem
                  label={L('Image')}
                  name="imageUrl"
                  initialValue={newsModel?.imageUrl ? newsModel?.imageUrl : undefined}
                  rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                  {...formItemLayout}
                >
                  <EditableImage
                    defaultFileList={
                      newsModel?.imageUrl
                        ? [
                            {
                              uid: 1,
                              name: 'imageUrl',
                              status: 'done',
                              url: newsModel?.imageUrl,
                              thumbUrl: newsModel?.imageUrl,
                            },
                          ]
                        : []
                    }
                    onSuccess={(url: string) =>
                      this.props.formRef.current?.setFieldsValue({ imageUrl: url })
                    }
                    onRemove={() =>
                      this.props.formRef.current?.setFieldsValue({
                        imageUrl: undefined,
                      })
                    }
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
    );
  }
}

export default CreateOrUpdateNews;
