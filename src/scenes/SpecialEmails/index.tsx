/* eslint-disable */
import * as React from 'react';
import { Button, Card, Col, Input, Row, Select, Switch } from 'antd';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import localization from '../../lib/localization';
import { SendOutlined } from '@ant-design/icons';
import Form, { FormInstance } from 'antd/lib/form';
import FormItem from 'antd/lib/form/FormItem';
import specialEmailsService from '../../services/specialEmails/specialEmailsService';
import { SpecialEmailDto } from '../../services/specialEmails/dto';
import { notifySuccess } from '../../lib/notifications';
import { LiteEntityDto } from '../../services/dto/liteEntityDto';
import clientsService from '../../services/clients/clientsService';
import shopManagersService from '../../services/shopManagers/shopManagersService';
import eventOrganizerService from '../../services/eventOrganizer/index';
import { EmailTargetType } from '../../lib/types';

export interface ISpecialEmailsProps {}

const formItemLayout = {
  labelCol: {
    xs: { span: 22 },
    sm: { span: 22 },
    md: { span: 18 },
    lg: { span: 18 },
    xl: { span: 18 },
    xxl: { span: 18 },
  },
  wrapperCol: {
    xs: { span: 22 },
    sm: { span: 22 },
    md: { span: 18 },
    lg: { span: 18 },
    xl: { span: 18 },
    xxl: { span: 18 },
  },
};

export interface ISpecialEmailsState {
  editMode: boolean;
  sending: boolean;
  forAllUsers: boolean;
  target?: EmailTargetType;
}

export class SpecialEmails extends AppComponentBase<ISpecialEmailsProps, ISpecialEmailsState> {
  formRef = React.createRef<FormInstance>();
  clients: LiteEntityDto[] = [];
  organizers: LiteEntityDto[] = [];
  shopManagers: LiteEntityDto[] = [];

  async componentDidMount() {
    const clientsResult = await clientsService.getAllLite({
      isActive: true,
      maxResultCount: 1000000,
      skipCount: 0,
    });
    this.clients = clientsResult.items;
    const shopManagersResult = await shopManagersService.getAllLite({
      isActive: true,
      skipCount: 0,
      maxResultCount: 1000000,
    });
    this.shopManagers = shopManagersResult.items;
    const organizersResult = await eventOrganizerService.getAllLite({
      isActive: true,
      skipCount: 0,
      maxResultCount: 1000000,
    });
    this.organizers = organizersResult.items;
  }
  state = {
    editMode: false,
    sending: false,
    forAllUsers: false,
    target: undefined,
  };

  config = {
    format_tags: 'p;h1;h2;h3;h4;h5;h6',
  };

  sendSpecialEmails = async () => {
    const form = this.formRef.current;
    form!.validateFields().then(async (values: SpecialEmailDto) => {
      this.setState({ sending: true });
      values.content = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="width:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0"><head><meta charset="UTF-8"><meta content="width=device-width, initial-scale=1" name="viewport"><meta name="x-apple-disable-message-reformatting"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta content="telephone=no" name="format-detection"><title>New email template 2022-07-23</title><!--[if (mso 16)]><style type="text/css">     a {text-decoration: none;}     </style><![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]><xml> <o:OfficeDocumentSettings> <o:AllowPNG></o:AllowPNG> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml><![endif]--><!--[if !mso]><!-- --><link href="https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i" rel="stylesheet"><!--<![endif]--><style type="text/css">#outlook a {	padding:0;}.ExternalClass {	width:100%;}*.hover:hover {	box-shadow:0 0 20px 0 #999999!important;	border-radius:12px!important;	border-width:1px!important;	display:inline-table!important;}.ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div {	line-height:100%;}.es-button {	mso-style-priority:100!important;	text-decoration:none!important;}a[x-apple-data-detectors] {	color:inherit!important;	text-decoration:none!important;	font-size:inherit!important;	font-family:inherit!important;	font-weight:inherit!important;	line-height:inherit!important;}.es-desk-hidden {	display:none;	float:left;	overflow:hidden;	width:0;	max-height:0;	line-height:0;	mso-hide:all;}[data-ogsb] .es-button {	border-width:0!important;	padding:10px 25px 10px 25px!important;}@media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120% } h1 { font-size:30px!important; text-align:left } h2 { font-size:26px!important; text-align:left } h3 { font-size:20px!important; text-align:left } h1 a { text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:30px!important } h2 a { text-align:left } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:26px!important } h3 a { text-align:left } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important } h4 { font-size:20px!important; text-align:left; line-height:120% } h4 a { font-size:20px!important; text-align:left } .es-menu td a { font-size:14px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:16px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:16px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:16px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:14px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:inline-block!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0!important } .es-m-p0r { padding-right:0!important } .es-m-p0l { padding-left:0!important } .es-m-p0t { padding-top:0!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } a.es-button, button.es-button { font-size:16px!important; display:inline-block!important } .es-m-p5 { padding:5px!important } .es-m-p5t { padding-top:5px!important } .es-m-p5b { padding-bottom:5px!important } .es-m-p5r { padding-right:5px!important } .es-m-p5l { padding-left:5px!important } .es-m-p10 { padding:10px!important } .es-m-p10t { padding-top:10px!important } .es-m-p10b { padding-bottom:10px!important } .es-m-p10r { padding-right:10px!important } .es-m-p10l { padding-left:10px!important } .es-m-p15 { padding:15px!important } .es-m-p15t { padding-top:15px!important } .es-m-p15b { padding-bottom:15px!important } .es-m-p15r { padding-right:15px!important } .es-m-p15l { padding-left:15px!important } .es-m-p20 { padding:20px!important } .es-m-p20t { padding-top:20px!important } .es-m-p20r { padding-right:20px!important } .es-m-p20l { padding-left:20px!important } .es-m-p25 { padding:25px!important } .es-m-p25t { padding-top:25px!important } .es-m-p25b { padding-bottom:25px!important } .es-m-p25r { padding-right:25px!important } .es-m-p25l { padding-left:25px!important } .es-m-p30 { padding:30px!important } .es-m-p30t { padding-top:30px!important } .es-m-p30b { padding-bottom:30px!important } .es-m-p30r { padding-right:30px!important } .es-m-p30l { padding-left:30px!important } .es-m-p35 { padding:35px!important } .es-m-p35t { padding-top:35px!important } .es-m-p35b { padding-bottom:35px!important } .es-m-p35r { padding-right:35px!important } .es-m-p35l { padding-left:35px!important } .es-m-p40 { padding:40px!important } .es-m-p40t { padding-top:40px!important } .es-m-p40b { padding-bottom:40px!important } .es-m-p40r { padding-right:40px!important } .es-m-p40l { padding-left:40px!important } table.w-auto, td.w-auto { width:auto!important } table.w-80, td.w-80 { width:80%!important } table.w-90, td.w-90 { width:90%!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; max-height:inherit!important } }</style></head>
<body style="width:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;padding:0;Margin:0"><div class="es-wrapper-color" style="background-color:#F9F9F9"><!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" color="#F9F9F9"></v:fill> </v:background><![endif]--><table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top"><tr style="border-collapse:collapse"><td valign="top" style="padding:0;Margin:0"><table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"><tr style="border-collapse:collapse"><td class="es-info-area" align="center" bgcolor="#FF5921" style="padding:0;Margin:0;background-color:#ff5921"><table bgcolor="#FFFFFF" class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px"><tr style="border-collapse:collapse"><td align="left" style="padding:10px;Margin:0"><!--[if mso]><table dir="rtl" style="width:580px" cellpadding="0" cellspacing="0"><tr><td dir="ltr" style="width:186px" valign="top"><![endif]--><table cellpadding="0" cellspacing="0" class="es-right" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right"><tr style="border-collapse:collapse"><td align="left" style="padding:0;Margin:0;width:186px"><table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td align="center" style="padding:0;Margin:0;display:none"></td>
</tr></table></td></tr></table><!--[if mso]></td><td dir="ltr" style="width:20px"></td><td dir="ltr" style="width:374px" valign="top"><![endif]--><table cellpadding="0" cellspacing="0" align="left" class="es-left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left"><tr style="border-collapse:collapse"><td align="center" valign="top" style="padding:0;Margin:0;width:374px"><table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td align="center" style="padding:0;Margin:0;display:none"></td></tr></table></td></tr></table><!--[if mso]></td></tr></table><![endif]--></td></tr></table></td>
</tr></table><table class="es-header" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top"><tr style="border-collapse:collapse"><td align="center" style="padding:0;Margin:0"><table class="es-header-body" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px"><tr style="border-collapse:collapse"><td align="left" background="https://takvzk.stripocdn.email/content/guids/CABINET_4d97b186d58a5e1ea58c9c6185a6936d/images/group_151_2.png" style="Margin:0;padding-left:10px;padding-right:10px;padding-bottom:20px;padding-top:40px;background-image:url(https://takvzk.stripocdn.email/content/guids/CABINET_4d97b186d58a5e1ea58c9c6185a6936d/images/group_151_2.png);background-repeat:no-repeat;background-position:center center"><table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td align="center" valign="top" style="padding:0;Margin:0;width:580px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td align="center" style="padding:0;Margin:0;font-size:0px"><a target="_blank" href="https://viewstripo.email/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#151D41;font-size:18px"><img src="https://takvzk.stripocdn.email/content/guids/CABINET_8dd5b239d43a41262b3ca11c61c7630b/images/lightlogo.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="180"></a></td>
</tr></table></td></tr></table></td>
</tr><tr style="border-collapse:collapse"><td align="left" style="padding:0;Margin:0;padding-left:10px;padding-right:10px"><table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td align="center" valign="top" style="padding:0;Margin:0;width:580px"><table cellpadding="0" cellspacing="0" width="100%" bgcolor="#ffffff" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;border-left:1px solid #e1effc;border-right:1px solid #e1effc;border-top:1px solid #e1effc;border-bottom:1px solid #e1effc;background-color:#ffffff;border-radius:12px;box-shadow:0px 20px 20px #999999" role="presentation"><tr style="border-collapse:collapse"><td style="padding:0;Margin:0"><table cellpadding="0" cellspacing="0" width="100%" class="es-menu" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr class="links" style="border-collapse:collapse"><td align="center" valign="top" width="20%" style="Margin:0;padding-left:5px;padding-right:5px;padding-top:15px;padding-bottom:15px;border:0" id="esd-menu-id-0"><a target="_blank" href="https://mansour-landing-page.vercel.app/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;display:block;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;color:#ff5921;font-size:18px;font-weight:normal">Home</a></td>
<td align="center" valign="top" width="20%" style="Margin:0;padding-left:5px;padding-right:5px;padding-top:15px;padding-bottom:15px;border:0;border-left:1px solid #e1effc" id="esd-menu-id-1"><a target="_blank" href="https://mansour-landing-page.vercel.app/shops" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;display:block;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;color:#ff5921;font-size:18px;font-weight:normal">Shops</a></td>
<td align="center" valign="top" width="20%" class="es-mobile-hidden" style="Margin:0;padding-left:5px;padding-right:5px;padding-top:15px;padding-bottom:15px;border:0;border-left:1px solid #e1effc" id="esd-menu-id-2"><a target="_blank" href="https://mansour-landing-page.vercel.app/events" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;display:block;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;color:#ff5921;font-size:18px;font-weight:normal">Events</a></td>
<td align="center" valign="top" width="20%" style="Margin:0;padding-left:5px;padding-right:5px;padding-top:15px;padding-bottom:15px;border:0;border-left:1px solid #e1effc" id="esd-menu-id-3"><a target="_blank" href="https://mansour-landing-page.vercel.app/contact" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;display:block;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;color:#ff5921;font-size:18px;font-weight:normal">Contact</a></td>
<td align="center" valign="top" width="20%" style="Margin:0;padding-left:5px;padding-right:5px;padding-top:15px;padding-bottom:15px;border:0;border-left:1px solid #e1effc" id="esd-menu-id-4"><a target="_blank" href="https://mansour-landing-page.vercel.app" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;display:block;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;color:#ff5921;font-size:18px;font-weight:normal">Get App</a></td></tr></table></td></tr></table></td></tr></table></td></tr></table></td>
</tr></table><table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"><tr style="border-collapse:collapse"><td align="center" style="padding:0;Margin:0"><table class="es-content-body" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px"><tr style="border-collapse:collapse"><td align="left" style="padding:0;Margin:0;padding-left:10px;padding-right:10px;padding-top:40px"><table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td align="center" valign="top" style="padding:0;Margin:0;width:580px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td align="center" style="padding:0;Margin:0"><h1 style="Margin:0;line-height:43px;mso-line-height-rule:exactly;font-family:'Roboto Condensed', 'Arial Narrow', Arial, sans-serif;font-size:36px;font-style:normal;font-weight:normal;color:#151D41">💢 ${values.subject}&nbsp;</h1>
</td></tr></table></td></tr></table></td>
</tr><tr style="border-collapse:collapse"><td align="left" style="padding:0;Margin:0;padding-left:10px;padding-right:10px;padding-top:40px"><table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td width="100%" align="center" valign="top" style="padding:0;Margin:0"><table cellpadding="0" class="hover w-80" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;border-top:1px solid #ebf3fb;border-radius:12px 12px 0px 0px;background-color:#fdfdfd;border-right:1px solid #ebf3fb;border-left:1px solid #ebf3fb;width:450px" bgcolor="#fdfdfd" role="presentation"><tr style="border-collapse:collapse"><td align="left" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:24px;color:#6C7083;font-size:16px">${values.content}</p>
</td></tr></table></td></tr></table></td></tr><tr style="border-collapse:collapse"><td align="left" style="padding:0;Margin:0;padding-left:10px;padding-right:10px;padding-top:20px"><table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td align="center" valign="top" style="padding:0;Margin:0;width:580px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td align="center" style="padding:0;Margin:0;font-size:0px"><img class="adapt-img" src="https://takvzk.stripocdn.email/content/guids/CABINET_4d97b186d58a5e1ea58c9c6185a6936d/images/verh_1.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="580"></td>
</tr></table></td>
</tr><tr style="border-collapse:collapse"><td align="center" valign="top" style="padding:0;Margin:0;width:580px"><table cellpadding="0" cellspacing="0" width="100%" bgcolor="#219653" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#219653;background-image:url(https://takvzk.stripocdn.email/content/guids/CABINET_4d97b186d58a5e1ea58c9c6185a6936d/images/seredina_1.png);background-repeat:no-repeat;background-position:center center;background-size:100% 100%" background="https://takvzk.stripocdn.email/content/guids/CABINET_4d97b186d58a5e1ea58c9c6185a6936d/images/seredina_1.png" role="presentation"><tr style="border-collapse:collapse"><td align="center" class="es-m-txt-c" style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:30px;padding-right:30px"><h3 style="Margin:0;line-height:29px;mso-line-height-rule:exactly;font-family:'Roboto Condensed', 'Arial Narrow', Arial, sans-serif;font-size:24px;font-style:normal;font-weight:normal;color:#ffffff">Find out the popular events happening now</h3>
</td></tr></table></td></tr></table></td></tr></table></td>
</tr></table><table class="es-footer" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:#151D41;background-repeat:repeat;background-position:center top"><tr style="border-collapse:collapse"><td align="center" style="padding:0;Margin:0"><table class="es-footer-body" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#151d41;width:600px" bgcolor="#151d41"><tr style="border-collapse:collapse"><td align="left" style="padding:0;Margin:0;padding-left:10px;padding-right:10px;padding-bottom:20px"><table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td align="center" valign="top" style="padding:0;Margin:0;width:580px"><table cellpadding="0" cellspacing="0" width="100%" bgcolor="#219653" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#219653;background-image:url(https://takvzk.stripocdn.email/content/guids/CABINET_4d97b186d58a5e1ea58c9c6185a6936d/images/seredina_2.png);background-repeat:no-repeat;background-position:center center;background-size:100% 100%" background="https://takvzk.stripocdn.email/content/guids/CABINET_4d97b186d58a5e1ea58c9c6185a6936d/images/seredina_2.png" role="presentation"><tr style="border-collapse:collapse"><td align="center" style="padding:0;Margin:0;padding-bottom:10px"><!--[if mso]><a href="https://mansour-landing-page.vercel.app/events" target="_blank" hidden> <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" esdevVmlButton href="https://mansour-landing-page.vercel.app/events" style="height:37px; v-text-anchor:middle; width:154px" arcsize="27%" strokecolor="#151d41" strokeweight="2px" fillcolor="#ffffff"> <w:anchorlock></w:anchorlock> <center style='color:#151d41; font-family:roboto, "helvetica neue", helvetica, arial, sans-serif; font-size:13px; font-weight:400; line-height:13px; mso-text-raise:1px'>Find out now!!</center> </v:roundrect></a><![endif]--><!--[if !mso]><!-- --><span class="msohide es-button-border" style="border-style:solid;border-color:#ff5921 #ff5921 #151d41;background:#ffffff;border-width:0px 0px 2px 0px;display:inline-block;border-radius:10px;width:auto;mso-hide:all"><a href="https://mansour-landing-page.vercel.app/events" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#151d41;font-size:16px;border-style:solid;border-color:#ffffff;border-width:10px 25px 10px 25px;display:inline-block;background:#ffffff;border-radius:10px;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;font-weight:normal;font-style:normal;line-height:19px;width:auto;text-align:center">Find out now!!</a></span><!--<![endif]--></td>
</tr></table></td></tr><tr style="border-collapse:collapse"><td align="center" valign="top" style="padding:0;Margin:0;width:580px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td align="center" style="padding:0;Margin:0;font-size:0px"><img class="adapt-img" src="https://takvzk.stripocdn.email/content/guids/CABINET_4d97b186d58a5e1ea58c9c6185a6936d/images/niz_1.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="580"></td></tr></table></td></tr></table></td>
</tr><tr style="border-collapse:collapse"><td align="left" style="padding:0;Margin:0;padding-left:10px;padding-right:10px;padding-top:40px"><!--[if mso]><table style="width:580px" cellpadding="0" cellspacing="0"><tr><td style="width:381px" valign="top"><![endif]--><table cellpadding="0" cellspacing="0" align="left" class="es-left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left"><tr style="border-collapse:collapse"><td class="es-m-p20b" align="center" valign="top" style="padding:0;Margin:0;width:381px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td align="left" class="es-m-txt-c" style="padding:0;Margin:0"><h3 style="Margin:0;line-height:29px;mso-line-height-rule:exactly;font-family:'Roboto Condensed', 'Arial Narrow', Arial, sans-serif;font-size:24px;font-style:normal;font-weight:normal;color:#ffffff">About Us</h3>
</td></tr><tr style="border-collapse:collapse"><td align="left" class="es-m-txt-c" style="padding:0;Margin:0;padding-top:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:28px;color:#FFFFFF;font-size:14px">Mohra is an Ecosystem of services that aspires to be the leader in all areas that serve the human being to improve the quality of life and provide a comprehensive environment for both individuals and enterprises under one roof with the higher standers and wonderful designs.</p></td></tr></table></td></tr></table><!--[if mso]></td><td style="width:40px"></td>
<td style="width:159px" valign="top"><![endif]--><table cellpadding="0" cellspacing="0" class="es-right" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right"><tr style="border-collapse:collapse"><td align="center" valign="top" style="padding:0;Margin:0;width:159px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td align="left" class="es-m-txt-c" style="padding:0;Margin:0"><h3 style="Margin:0;line-height:29px;mso-line-height-rule:exactly;font-family:'Roboto Condensed', 'Arial Narrow', Arial, sans-serif;font-size:24px;font-style:normal;font-weight:normal;color:#ffffff">Contact Us</h3></td>
</tr><tr style="border-collapse:collapse"><td align="left" class="es-m-txt-c" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:28px;color:#FFFFFF;font-size:14px">Email: <a target="_blank" href="mailto:your@mail.com" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#FFFFFF;font-size:14px;line-height:28px">your@mail.com</a><br>Phone: <a target="_blank" href="tel:123456789" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#FFFFFF;font-size:14px;line-height:28px">123456789</a></p></td>
</tr><tr style="border-collapse:collapse"><td align="left" class="es-m-txt-c" style="padding:0;Margin:0;font-size:0"><table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px"><img title="Facebook" src="https://takvzk.stripocdn.email/content/assets/img/social-icons/logo-white/facebook-logo-white.png" alt="Fb" width="24" height="24" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></td>
<td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px"><img title="Twitter" src="https://takvzk.stripocdn.email/content/assets/img/social-icons/logo-white/twitter-logo-white.png" alt="Tw" width="24" height="24" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></td><td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px"><img title="Instagram" src="https://takvzk.stripocdn.email/content/assets/img/social-icons/logo-white/instagram-logo-white.png" alt="Inst" width="24" height="24" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></td>
<td align="center" valign="top" style="padding:0;Margin:0"><img title="Youtube" src="https://takvzk.stripocdn.email/content/assets/img/social-icons/logo-white/youtube-logo-white.png" alt="Yt" width="24" height="24" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></td></tr></table></td></tr></table></td></tr></table><!--[if mso]></td></tr></table><![endif]--></td>
</tr><tr style="border-collapse:collapse"><td align="left" style="Margin:0;padding-left:10px;padding-right:10px;padding-top:40px;padding-bottom:40px"><table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td align="center" valign="top" style="padding:0;Margin:0;width:580px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td align="center" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#FFFFFF;font-size:14px">© Copyright 2022&nbsp; |&nbsp; All Rights Reserved</p></td></tr></table></td>
</tr></table></td></tr></table></td></tr></table></td></tr></table></div></body></html>
`;
      await specialEmailsService.SendSpecialEmail(values);
      this.setState({ sending: false }, () => {
        notifySuccess();
      });
    });
  };

  public render() {
    return (
      <Card
        style={{ minHeight: '70vh' }}
        title={
          <div>
            <span>{L('SpecialEmails')}</span>
            <Button
              type="primary"
              style={{ float: localization.getFloat() }}
              disabled={this.state.editMode ? false : true}
              icon={<SendOutlined />}
              loading={this.state.sending}
              onClick={async () => await this.sendSpecialEmails()}
            >
              {L('Send')}
            </Button>
          </div>
        }
      >
        <Form
          ref={this.formRef}
          layout="vertical"
          className={localization.isRTL() ? 'rtl-form' : 'ltr-form'}
        >
          <Row>
            <Col xs={24} md={12}>
              <FormItem
                label={L('Target')}
                name="target"
                {...formItemLayout}
                colon={false}
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
              >
                <Select
                  placeholder={L('PleaseSelectTarget')}
                  onChange={(e) => {
                    this.setState({ editMode: true, target: e });
                  }}
                >
                  <Select.Option key={EmailTargetType.Client} value={EmailTargetType.Client}>
                    {L('Client')}
                  </Select.Option>
                  <Select.Option
                    key={EmailTargetType.EventOrganizer}
                    value={EmailTargetType.EventOrganizer}
                  >
                    {L('EventOrganizer')}
                  </Select.Option>
                  <Select.Option
                    key={EmailTargetType.ShopManager}
                    value={EmailTargetType.ShopManager}
                  >
                    {L('ShopManager')}
                  </Select.Option>
                </Select>
              </FormItem>
            </Col>
            <Col xs={24} md={12}>
              <FormItem
                name="forAll"
                colon={false}
                label={L('forAllUsers')}
                {...formItemLayout}
                valuePropName="checked"
              >
                <Switch
                  checkedChildren={L('Yes')}
                  unCheckedChildren={L('No')}
                  onChange={(checked: boolean) =>
                    this.setState({ forAllUsers: checked, editMode: true })
                  }
                />
              </FormItem>
            </Col>
            {!this.state.forAllUsers && (
              <Col xs={24} md={12}>
                <FormItem
                  label={
                    this.state.target === undefined
                      ? L('Users')
                      : this.state.target === EmailTargetType.Client
                      ? L('Clients')
                      : this.state.target === EmailTargetType.ShopManager
                      ? L('ShopManagers')
                      : L('EventOrganizers')
                  }
                  rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                  {...formItemLayout}
                  name="ids"
                >
                  <Select
                    mode="multiple"
                    onChange={(e) => {
                      this.setState({ editMode: true });
                    }}
                    placeholder={L('PleaseSelectUsers')}
                    showSearch
                    optionFilterProp="children"
                  >
                    {this.state.target === undefined
                      ? null
                      : this.state.target === EmailTargetType.Client
                      ? this.clients?.map((element: LiteEntityDto) => (
                          <Select.Option key={element.value} value={element.value}>
                            {element.text}
                          </Select.Option>
                        ))
                      : this.state.target === EmailTargetType.ShopManager
                      ? this.shopManagers.map((element: LiteEntityDto) => (
                          <Select.Option key={element.value} value={element.value}>
                            {element.text}
                          </Select.Option>
                        ))
                      : this.organizers.map((element: LiteEntityDto) => (
                          <Select.Option key={element.value} value={element.value}>
                            {element.text}
                          </Select.Option>
                        ))}
                  </Select>
                </FormItem>
              </Col>
            )}
            {/* <Col xs={24} md={12}>
              <FormItem
                name="mustBeConfierEmail"
                colon={false}
                label={L('MustBeConfierEmail')}
                {...formItemLayout}
                valuePropName="checked"
              >
                <Switch
                  onChange={(e) => {
                    this.setState({ editMode: true });
                  }}
                  checkedChildren={L('Yes')}
                  unCheckedChildren={L('No')}
                />
              </FormItem>
            </Col> */}
            <Col xs={24} md={12}>
              <FormItem
                label={L('Subject')}
                name="subject"
                {...formItemLayout}
                colon={false}
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
              >
                <Input
                  onChange={(e) => {
                    this.setState({ editMode: true });
                  }}
                />
              </FormItem>
            </Col>
            <Col xs={24} md={12}>
              <FormItem
                label={L('Content')}
                name="content"
                {...formItemLayout}
                colon={false}
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
              >
                <Input.TextArea
                  rows={4}
                  onChange={(e) => {
                    this.setState({ editMode: true });
                  }}
                />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
}

export default SpecialEmails;
