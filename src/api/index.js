import request from '../utils/request';
import axios from 'axios';

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
