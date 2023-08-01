interface AppConfigInterface {
  ownerRoles: string[];
  customerRoles: string[];
  tenantRoles: string[];
  tenantName: string;
  applicationName: string;
  addOns: string[];
}
export const appConfig: AppConfigInterface = {
  ownerRoles: ['School Administrator'],
  customerRoles: ['Student'],
  tenantRoles: ['School Administrator', 'Teacher', 'IT Staff'],
  tenantName: 'School',
  applicationName: 'school',
  addOns: ['file upload', 'chat', 'notifications', 'file'],
};
