export type {
  CreateAdminResponse,
  CreateAdminParams,
  UpdateOtpSecretParams,
  UpdateOtpSecretResponse,
  DeleteAdminParams,
  DeleteAdminResponse,
  UpdateAdminParams,
  UpdateAdminResponse,
} from './admin';
export {
  UPDATE_OTP_SECRET,
  CREATE_ADMIN,
  DELETE_ADMIN,
  UPDATE_ADMIN,
} from './admin';

export type {
  ReplyInquiryByAdminParams,
  ReplyInquiryByAdminResponse,
} from './inquiry';
export { REPLY_INQUIRY_BY_ADMIN } from './inquiry';

export type {
  UpdateNoticeResponse,
  UpdateNoticeParams,
  DeleteNoticeResponse,
  DeleteNoticeParams,
  CreateNoticeRespons,
  CreateNoticeParams,
  ConfirmPartnershipInquiryParams,
  ConfirmPartnershipInquiryResponse,
  CreateFaqParams,
  UpdateFaqParams,
  UpdateFaqResponse,
  UploadNoticeImageParams,
  UploadNoticeImageResponse,
  CreateFaqResponse,
  DeleteFaqParams,
  DeleteFaqResponse,
} from './customer';
export {
  CREATE_NOTICE,
  DELETE_NOTICE,
  UPDATE_NOTICE,
  CONFIRM_PARTNERSHIP_INQUIRY,
  CREATE_FAQ,
  DELETE_FAQ,
  UPDATE_FAQ,
  UPLOAD_NOTICE_IMAGE,
} from './customer';

export type {
  CreatePolicyParams,
  CreatePolicyResponse,
  DeletePolicyParams,
  DeletePolicyResponse,
  UpdatePolicyParams,
  UpdatePolicyResponse,
} from './policy';
export { UPDATE_POLICY, CREATE_POLICY, DELETE_POLICY } from './policy';

export type {
  UploadGiveawayImageResponse,
  CreateGiveawayParams,
  CreateGiveawayResponse,
  UpdateGiveawayParams,
  UpdateGiveawayResponse,
} from './giveaway';
export {
  UPLOAD_GIVEAWAY_IMAGE,
  CREATE_GIVEAWAY,
  UPDATE_GIVEAWAY,
} from './giveaway';

export type {
  UploadBroadcastInfoImageResponse,
  CreateBraodcastInfoParams,
  UpdateBroadcastInfoParams,
  UpdateBroadcastInfoResponse,
  CreateBroadcastInfoResponse,
} from './broadcast';
export {
  UPLOAD_BROADCAST_INFO_IMAGE,
  CREATE_BROADCAST_INFO,
  UPDATE_BROADCAST_INFO,
} from './broadcast';

export type {
  UpdateAdvertisementParams,
  UpdateAdvertisementResponse,
  UploadAdvertisementImageResponse,
  UploadAdvertisementVideoParams,
  UploadAdvertisementVideoResponse,
  DeleteAdvertisementVideoResponse,
  DeleteAdvertisementVideoParams,
  DeleteAdvertisementParams,
  DeleteAdvertisementResponse,
  CreateAdvertisementParams,
  CreateAdvertisementResponse,
} from './ad';
export {
  DELETE_ADVERTISEMENT,
  UPDATE_AD,
  UPLOAD_ADVERTISEMENT_IMAGE,
  UPLOAD_ADVERTISEMENT_VIDEO,
  DELETE_ADVERTISEMENT_VIDEO,
  CREATE_ADVERTISEMENT,
} from './ad';

export type {
  CreateWinningNumberParams,
  CreateWinningNumberResponse,
  UpdateWinningNumberParams,
} from './again';
export { CREATE_WINNING_NUMBER, UPDATE_WINNING_NUMBER } from './again';

export type {
  UpdateStaticLinkParams,
  UpdateStaticLinkResponse,
} from './youtube';
export { UPDATE_STATIC_URL, TOGGLE_YOUTUBE_SUBSCRIPTION } from './youtube';

export type {
  UpdatePartnershipNoParams,
  UpdatePartnershipNoResponse,
  CreatePartnershipParams,
  CreatePartnershipResponse,
  UpdatePartnershipParams,
  UpdatePartnershipResponse,
  DeletePartnershipParams,
  DeletePartnershipResponse,
} from './partnership';
export {
  UPDATE_PARTNERSHIP_NO,
  UPDATE_PARTNERSHIP,
  CREATE_PARTNERSHIP,
  DELETE_PARTNERSHIP,
} from './partnership';
