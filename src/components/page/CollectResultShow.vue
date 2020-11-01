<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 采集状态展示
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">

                <el-input v-model="conditionParam.collectId" placeholder="输入采集轮次id进行查询" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
            </div>
            <el-table
                    :data="curPageData"
                    border
                    stripe
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column width="100" label="采集轮次id" align="center">
                    <template slot-scope="scope">
                        {{showItemInfo(scope.row, "collectId")}}
                    </template>
                </el-table-column>
                <el-table-column width="100" label="被试者id" align="center">
                    <template slot-scope="scope">
                        {{showItemInfo(scope.row, "patientId")}}
                    </template>
                </el-table-column>
                <el-table-column width="100" label="被试姓名" align="center">
                    <template slot-scope="scope">
                        {{showItemInfo(scope.row, "patientName")}}
                    </template>
                </el-table-column>
                <el-table-column width="100" label="医师id" align="center">
                    <template slot-scope="scope">
                        {{showItemInfo(scope.row, "doctorId")}}
                    </template>
                </el-table-column>
                <el-table-column label="当前诊断类型" align="center">
                    <template slot-scope="scope">
                        {{showItemInfo(scope.row, "typeDesc")}}
                    </template>
                </el-table-column>
                <el-table-column style="min-width: 330px" label="进行任务" align="center">
                    <template slot-scope="scope">
                        <el-button v-for="(item,index) in scope.row.operateTaskNames"
                                   type="success"
                                   @click="gotoTaskData(scope.row.operateTaskIds[index], scope.row)">{{item}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column width="150" label="采集报告" align="center">
                    <template slot-scope="scope">
                        <el-button type="warning" @click="gotoReport(scope.row.reportUrlPath)">查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column width="150" label="辅助分析" align="center">
                    <template slot-scope="scope">
                        <el-button style="color: white; background-color: #00d1b2" @click="gotoAnalysis(scope.row)">进行分析</el-button>
                    </template>
                </el-table-column>

            </el-table>

            <div class="pagination">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="query.pageIndex"
                        :page-size="query.pageSize"
                        :total="pageTotal"
                        @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!--文本框-->
        <el-dialog title="详情" :visible.sync="editVisible" width="80%">
            <h3>{{windowTitle}}</h3>
            <div v-show="!dataValid" style="alignment: center">
                抱歉，数据异常或丢失
            </div>
            <div v-show="dataValid" style="alignment: center">

                <div v-show="!empty(taskRecords)">
                    <div v-for="(v, k, index) in taskRecords" :key="index">{{k}} :  {{v}}</div>
                </div>

                <div v-if="xueyangData !== null && !empty(xueyangData) && xueyangData.valid===true">
                    tu
                    <div id="echarts_box" style="width: 90%;height:90%;"></div>

                </div>
                <div v-else>
                    血氧数据丢失或错误
                </div>
            </div>
        </el-dialog>
    </div>
</template>


<script>
    import { getCollectDetailedDataByTaskId, getCollectResult } from '../../api';
    import bus from '../common/bus';
    import echarts from 'echarts'

    function isStrEmpty(obj) {
        return typeof obj == 'undefined' || obj == null || obj === '';
    }

    function isEmptyObject(obj){
        for (let n in obj) {
            return false
        }
        return true;
    }

    const maxShowNumPerPage = 10;
    export default {
        name: 'patientTable',
        data() {
            return {
                conditionParam: {
                    collectId: "",
                },
                query: {
                    address: '',
                    name: '',
                    pageIndex: 1,
                    pageSize: maxShowNumPerPage
                },
                curPageData: [],
                receivedData: [

                ],
                multipleSelection: [],
                delList: [],
                detailText: '',
                pageTotal: 0,
                form: {},
                idx: -1,
                id: -1,
                editVisible: false,
                dataValid: true,
                windowTitle: '',
                taskRecords: {},
                xueyangData: {}
            };
        },
        created() {
            let myChart = echarts.init(document.getElementById('echarts_box'));
            console.log('------------');
            console.log(myChart);
            let opt = {
                title: {
                    text: '一天用电量分布',
                    subtext: '纯属虚构'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                toolbox: {
                    show: true,
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['00:00', '01:15', '02:30', '03:45', '05:00', '06:15', '07:30', '08:45', '10:00', '11:15', '12:30', '13:45', '15:00', '16:15', '17:30', '18:45', '20:00', '21:15', '22:30', '23:45']
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} W'
                    },
                    axisPointer: {
                        snap: true
                    }
                },
                visualMap: {
                    show: false,
                    dimension: 0,
                    pieces: [{
                        lte: 6,
                        color: 'green'
                    }, {
                        gt: 6,
                        lte: 8,
                        color: 'red'
                    }, {
                        gt: 8,
                        lte: 14,
                        color: 'green'
                    }, {
                        gt: 14,
                        lte: 17,
                        color: 'red'
                    }, {
                        gt: 17,
                        color: 'green'
                    }]
                },
                series: [
                    {
                        name: '用电量',
                        type: 'line',
                        smooth: true,
                        data: [300, 280, 250, 260, 270, 300, 550, 500, 400, 390, 380, 390, 400, 500, 600, 750, 800, 700, 600, 400],
                        markArea: {
                            data: [ [{
                                name: '早高峰',
                                xAxis: '07:30'
                            }, {
                                xAxis: '10:00'
                            }], [{
                                name: '晚高峰',
                                xAxis: '17:30'
                            }, {
                                xAxis: '21:15'
                            }] ]
                        }
                    }
                ]
            };
            myChart.setOption(opt);
            this.getData();
        },
        methods: {
            empty(obj){
                return isEmptyObject(obj);
            },
            getData() {

                getCollectResult().then(res => {
                    if (res.code === 200) {
                        let totalData = res.data;
                        if (totalData) {
                            this.receivedData = totalData;
                        }
                    }
                    this.pageTotal = this.receivedData.length;
                    this.query.pageIndex = 1;
                    this.refreshPageData(1);
                });
            },
            showItemInfo(collectionResult, item){
                let text = "";
                if (collectionResult !== undefined && collectionResult != null && collectionResult[item] !== undefined) {
                    text = collectionResult[item];
                }
                return text;
            },
            // 刷新pageIndex页的展示数据
            refreshPageData(pageIndex) {
                let start = maxShowNumPerPage * (pageIndex - 1);
                this.curPageData = this.receivedData.slice(start, start + maxShowNumPerPage);
            },
            gotoReport(path) {
                if (isStrEmpty(path)) {
                    this.$message.error('无法查看');
                } else {
                    window.open(path, '_blank');
                }
            },
            gotoAnalysis(row) {
                if (!isStrEmpty(row.collectId)) {
                    this.$router.push('/analysis');
                    bus.$emit("gotoAnalysis", [row.collectId, row.patientId]);
                }
            },
            gotoTaskData(taskId, dataRow) {
                let collectId = dataRow["collectId"];
                let patientId = dataRow["patientId"];
                getCollectDetailedDataByTaskId(collectId, patientId, taskId).then(res => {
                    if (res.code === 200) {
                        console.log(res.data);
                        let data = res.data;

                        this.dataValid = data.valid;
                        this.windowTitle = data.taskName ? data.taskName: "错误";
                        this.taskRecords = data.records ? data.records : {};
                        this.xueyangData = data.bloodoxygenFileData !== null ? data.bloodoxygenFileData : {};
                        this.editVisible = true;
                    }
                })
            },
            // 触发搜索按钮
            handleSearch() {
                // this.getData();
                if (isStrEmpty(this.conditionParam.collectId)) {
                    this.query.pageIndex = 1;
                    this.pageTotal = this.receivedData.length;
                    this.refreshPageData(1);
                } else {
                    this.$set(this.query, 'pageIndex', 1);
                    let temp = [];
                    let len = this.receivedData.length;
                    for(let i = 0; i < len; i++) {
                        if (this.receivedData[i].collectId === this.conditionParam.collectId.trim()) {
                            temp.push(this.receivedData[i]);
                            break;
                        }
                    }
                    this.curPageData = temp;
                    this.pageTotal = this.curPageData.length;
                    this.query.pageIndex = 1;
                }
            },
            addPatient() {

            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageIndex', val);
                this.refreshPageData(val);
            }
        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 140px;
    }

    .handle-input {
        width: 180px;
        display: inline-block;
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .red {
        color: #ff0000;
    }

    .mr10 {
        margin-right: 10px;
    }

    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }
</style>
