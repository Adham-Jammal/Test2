/* eslint-disable */
import React from 'react';
import { Modal, Descriptions, Tag, Table, Image, Spin } from 'antd';
import moment from 'moment';
import { L } from '../../../../i18next';
import localization from '../../../../lib/localization';
import timingHelper from '../../../../lib/timingHelper';
import { ProductDto, ProductCombinationCreationDto } from '../../../../services/products/dto';
import CustomObject from '../../../../services/dto/customObject';

interface ProductDetailsProps {
  visible: boolean;
  onCancel: () => void;
  productData?: ProductDto;
  isGettingData?: boolean;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  visible,
  onCancel,
  productData = {},
  isGettingData = false,
}) => {
  const {
    quantity,
    availableStock,
    imageUrl,
    arDescription,
    enDescription,
    price,
    shop,
    createdBy,
    creationTime,
    classificationName,
    gallery = [],
    isFeatured,
    rate,
    ratesCount,
    soldCount,
    isFavorite,
    combinations,
    attributes = [],
    isActive,
    arName,
    enName,
    number,
    id,
  } = productData || {};

  // combination columns
  const combinationColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: L('Price'),
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: L('Quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: L('color'),
      dataIndex: 'colorName',
      key: 'colorName',
    },
    {
      title: L('color'),
      dataIndex: 'colorName',
      key: 'colorName',
    },
    {
      title: L('size'),
      key: 'sizeName',
      dataIndex: 'sizeName',
    },
  ];
  // attributes columns
  const attributesColumns = [
    {
      title: L('attribute'),
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: L('value'),
      dataIndex: 'value',
      key: 'value',
    },
  ];
  return (
    <Modal
      width="80%"
      style={{ padding: '20px' }}
      visible={visible}
      title={L('ProductDetails')}
      onCancel={onCancel}
      centered
      destroyOnClose
      className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
      footer={false}
    >
      <div className="scrollable-modal">
        {isGettingData ? (
          <div className="loading-comp">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <Descriptions
              className="descriptions-wrap"
              column={{
                xs: 1,
                sm: 1,
                md: 2,
                lg: 2,
                xl: 2,
              }}
              layout="vertical"
            >
              <Descriptions.Item label={L('ID')}>{id}</Descriptions.Item>
              <Descriptions.Item label={L('Number')}>{number}</Descriptions.Item>
              <Descriptions.Item label={L('ArName')}>{arName ?? ''}</Descriptions.Item>
              <Descriptions.Item label={L('EnName')}>{enName ?? ''}</Descriptions.Item>
              <Descriptions.Item label={L('ArDescription')}>
                {arDescription ?? ''}
              </Descriptions.Item>
              <Descriptions.Item label={L('EnDescription')}>
                {enDescription ?? ''}
              </Descriptions.Item>
              <Descriptions.Item label={L('ClassificationName')}>
                {classificationName ?? ''}
              </Descriptions.Item>
              <Descriptions.Item label={L('ShopName')}>{shop?.name ?? ''}</Descriptions.Item>
              <Descriptions.Item label={L('Price')}>{price ?? ''}</Descriptions.Item>
              <Descriptions.Item label={L('Quantity')}>{quantity ?? ''}</Descriptions.Item>
              <Descriptions.Item label={L('AvailableStock')}>
                {availableStock ?? ''}
              </Descriptions.Item>
              <Descriptions.Item label={L('soldCount')}>{soldCount ?? ''}</Descriptions.Item>
              <Descriptions.Item label={L('rate')}>{rate ?? ''}</Descriptions.Item>
              <Descriptions.Item label={L('rateCount')}>{ratesCount ?? ''}</Descriptions.Item>
              <Descriptions.Item label={L('CreationDate')}>
                {creationTime && moment(creationTime).format(timingHelper.defaultDateFormat)}
              </Descriptions.Item>
              <Descriptions.Item label={L('CreatedBy')}>{createdBy ?? ''}</Descriptions.Item>
              <Descriptions.Item label={L('IsActive')}>
                <Tag
                  color={isActive && isActive !== undefined ? 'green' : 'volcano'}
                  className="ant-tag-disable-pointer"
                >
                  {isActive && isActive !== undefined ? L('Active') : L('Inactive')}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label={L('isFeatured')}>
                <Tag
                  color={isFeatured && isFeatured !== undefined ? 'green' : 'volcano'}
                  className="ant-tag-disable-pointer"
                >
                  {isFeatured && isFeatured !== undefined ? L('Featured') : L('Unfeatured')}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label={L('isFavorite')}>
                <Tag
                  color={isFavorite && isFavorite !== undefined ? 'green' : 'volcano'}
                  className="ant-tag-disable-pointer"
                >
                  {isFavorite && isFavorite !== undefined ? L('Yes') : L('No')}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label={L('CreatedBy')}>{createdBy ?? ''}</Descriptions.Item>
              <Descriptions.Item label={L('Image')}>
                <Image src={imageUrl ?? ''} width={50} height={50} />
              </Descriptions.Item>
              {gallery && gallery?.length > 0 && (
                <Descriptions.Item label={L('Gallery')}>
                  <Image.PreviewGroup>
                    {gallery?.map((url: string) => (
                      <Image key={url} width={50} height={50} src={url} />
                    ))}
                  </Image.PreviewGroup>
                </Descriptions.Item>
              )}
            </Descriptions>

            <Table
              dataSource={combinations ?? []}
              columns={combinationColumns}
              rowKey={(record: ProductCombinationCreationDto) => record.colorId}
            />
            <Table
              dataSource={attributes ?? []}
              columns={attributesColumns}
              rowKey={(record: CustomObject<string>) => record.colorId}
            />
          </>
        )}
      </div>
    </Modal>
  );
};

export default ProductDetails;
