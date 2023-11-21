export interface accountuser {
  accountuser_id : number;
  email : string;
  password : string;
  account_type : number;
}
export interface holder {
  householdid : string;
  fname : string;
  mname : string;
  lname : string;
  birthdate : string;
  address : string;
  maritalstatus : string;
  mobile_number : string;
  spoucename : string;
  spoucebirthdate : string;
  assigned : string;
  update_by : string;
}
export interface accountdetails {
  accoundetails_id : number;
  fName : string;
  lName : string;
  address : string;
  schoolName : string;
  mobile_number : number;
  householdNumber : string;
  profile_piclink : string;
  account_type : number;
}

export interface child_beneficiary{
  statusName: number;
  statusText: string;
  child_id : number;
  accoundetails_id : number;
  schoolName : string;
  beneficiary_status : number;
  fname: string;
  lname: string;
  birthdate: string;
  snhcourse: string;
  collegecourse: string;
  other_status: string;
  profile_piclink: string;
  status: number;

}


export interface loginform {
  email: string;
  password: string;
}

export interface getalluser {
  accoundetails_id : number;
  fname : string;
  lname : string;
  address : string;
  schoolName : string;
  householdNumber : string;
  profile_piclink : string;
  account_type : number;
  accountTypeName: string;
}

export interface schoolname {
  schoolName : string;
}

export interface ProfileData {
  accountdetail_id : number;
  accountuser_id: number;
  fName : string;
  lName : string;
  address : string;
  schoolName : string;
  mobile_number : number;
  householdNumber : string;
  profile_piclink : string;
  email: string;
  password: string;
}

export interface userprofile{
  accoundetails_id : number;
  fName : string;
  lName : string;
  address : string;
  schoolName : string;
  mobile_number : number;
  householdNumber : string;
  profile_piclink : string;
}

export interface createbeneficiaryForm{
  householdNumber : string;
}

export interface changepassword{
  accountuser_id : number;
  password : string;
  newpassword : string;
}

export interface statusNames{
  status : string;
  value: number;
}


export interface barangayNames{
  barangay : string;
}
