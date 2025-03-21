import AsyncStorage from "@react-native-async-storage/async-storage";
import { addEmpLeave, getEmpLeavedata, addClaim, getEmpClaimdata, getExpenseItemList, getProjectList, getEmpAttendanceData, getEmpHolidayData, empCheckData, processClaim, getClaimApproverList, getActivities, getActivityQc, processActivity, getInventoryItemList, processItemInv, userTaskListURL, empLoginURL } from "../services/ConstantServies";
import { authAxios, authAxiosFilePost, authAxiosPost } from "./HttpMethod";

export async function getUserTasks(task_type, customer_id, lead_id) {
  let data = {};
  
  // Fetch emp_id asynchronously
  const emp_id = await AsyncStorage.getItem('empId');

  if (task_type) {
    data['task_type'] = task_type;
  }
  if (customer_id) {
    data['customer_id'] = customer_id;
  }
  if (emp_id) {
    data['emp_id'] = emp_id;
  }
  if (lead_id) {
    data['lead_id'] = lead_id;
  }

  console.log('getUserTasks', data)
  return authAxios(userTaskListURL, data);
}

export function getEmpLeave(leave_type , emp_id, year) {
    let data = {};
    if (leave_type ){
        data['leave_type '] = leave_type;
    }
    if (emp_id){
        data['emp_id'] = emp_id;
    }
    if (year){
        data['year'] = year;
    }
  
    // console.log('getUserTasks', task_type, userTaskListURL, data)
    return authAxios(getEmpLeavedata, data)
  }
  
  export function postEmpLeave(leave_type) {
    let data = {};
    if (leave_type) {
      data['leave_data'] = leave_type;
    }
    // console.log('Data to be sent:', data);
    return authAxiosPost(addEmpLeave, data)
  
  }

  export function postClaim(claim_data) {
    let data = {};
    if (claim_data) {
      data = claim_data;
    }
    // console.log('Data to be sent:', claim_data);
    return authAxiosFilePost(addClaim, claim_data)
  }

  export function postClaimAction(claim_type) {
    let data = {};
    if (claim_type) {
      data['claim_data'] = claim_type;
    }
    // console.log('Data to be sent:', data);
    return authAxiosPost(processClaim, data)
  
  }

  export function getClaimApprover() { 
    let data = {};
    return authAxios(getClaimApproverList)
  }

  export function getEmpClaim(res) {
    let data = {
      'call_mode':res
    };
    
    // console.log(res)
    return authAxios(getEmpClaimdata, data)
  }

  export function getExpenseItem() { 
    return authAxios(getExpenseItemList)
  }

  export function getExpenseProjectList() { 
    return authAxios(getProjectList)
  }

  export function getEmpAttendance(res) {
    let data = {
      'emp_id':res.emp_id,
      'month':res.month,
      'year': res.year
    };
    // console.log('Final response data',data)
    return authAxios(getEmpAttendanceData, data)
  }

  export function getEmpHoliday(res) {
    let data = {
      'year': res.year
    };
    // console.log(data,'Final response data')
    return authAxios(getEmpHolidayData, data)
  }

  export function postCheckIn(checkin_data) {
    let data = {};
    if (checkin_data) {
      data['attendance_data'] = checkin_data;
      // data = checkin_data;
    }
    // console.log('Data to be sent:', data);
    return authAxiosPost(empCheckData, data)
  }


  export function getActivityList() { 
    
    return authAxios(getActivities)
  }

  export function getManagerActivityList(res) { 
    let data = {
      'call_mode': res.call_mode 
    };
    console.log('callt type==',res.call_mode)
    return authAxios(getActivities,data)
  }

  

  export function getActivitiQcData(res) {

    let data = {
      'activity_id':res.activity_id,
      'call_mode': res.call_mode 

    };
    
    // console.log('Data==',data)
    return authAxios(getActivityQc, data)
  }


  export function postActivtyInventory(activity_invt_process) {
    let data = {};
    if (activity_invt_process) {
      data['activity_data'] = activity_invt_process;
    }
    // console.log('Data to be sent:', data);s
    return authAxiosPost(processActivity, data)
  
  }

  export function getInventoryItem() { 
    return authAxios(getInventoryItemList)
  }

  export function processItemSrl(res) {
    let data = {};
    if (res) {
      data['item_data'] = res;
    }
    console.log('Data to be sent:', data);
    return authAxiosPost(processItemInv, data)
  
  }

  export function empLoginPrc(res) {
    let data = {};
    if (res) {
      data['login_data'] = res;
    }
    console.log('Data to be sent:', data);
    return authAxiosPost(empLoginURL, data)
  
  }