import request from '../utils/request';
import axios from 'axios';
import col from 'element-ui/packages/col/src/col';

export const fetchData = param => {
    return request({
        url: '/mds/file/info',
        method: 'get',
        params: param
    });
};

export const deleteFile = param => {
    let fileRelativePath = [];
    let len = param.length;
    for(let i = 0; i < len; i++) {
        fileRelativePath.push(param[i].fileRelativePath);
    }
    return request({
        url: '/mds/file/delete/batch',
        method: 'post',
        data: fileRelativePath
    });
};

export const downloadFile = (param, timeout) => {
    let url = '/mds/file/download/batch';
    if (timeout !== undefined && timeout > 0) {
        return request({
            url: url,
            method: 'post',
            data: param,
            timeout: timeout
        });
    } else {
        return request({
            url: url,
            method: 'post',
            data: param
        });
    }

};

export const getMedicineList = () => {
    return request({
        url: '/mds/medicine/list',
        method: 'get'
    });

};

export const insertPatient = (data) => {
    return request({
        // 虽然叫upsert但是只有insert的功能
        url: '/mds/patient/upsert',
        method: 'post',
        data: data
    });

};

//获取用户诊断历程（时间流）信息
export const fetchTimeFLowEvent = patientId => {
    return request({
        url: '/mds/timeflow/' + patientId,
        method: 'get'
    });
};

//获取dashboard页信息
export const dashboardRequest = () => {
    return request({
        url: '/mds/dashboard',
        method: 'get'
    });
};

export const fetchPatientBasicInfo = () => {
    return request({
        url: '/mds/patients/basic',
        method: 'get'
    });
};


export const getCollectResult = () => {
    return request({
        url: '/mds/collects/show',
        method: 'get'
    });
};

export const getCollectDetailedData = (collectId, patientId) => {
    return request({
        url: '/mds/collect/detail/' + collectId + '/' + patientId,
        method: 'get'
    });
};

export const newCollect = (data) => {
    return request({
        url: '/mds/collect/new',
        method: 'post',
        data: data
    });
};

export const getCollectDetailedDataByTaskId = (collectId, patientId, taskId) => {
    return request({
        url: '/mds/collect/detail/' + collectId + '/' + patientId + '/' + taskId,
        method: 'get'
    });
};

export const addTaskForBinFile = (taskData, binFile) => {
    let formData = new FormData();
    formData.append("file", binFile);  // 文件对象
    formData.append("data", JSON.stringify(taskData));
    return request({
        url: '/mds/collect/task/web',
        method: 'post',
        data: formData,
        headers: {'Content-Type': 'multipart/form-data'}
    });
};
