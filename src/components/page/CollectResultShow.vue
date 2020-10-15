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
        <el-dialog title="详情" :visible.sync="editVisible" width="30%">
            <div style="alignment: center">
                {{detailText}}
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { getCollectDetailedDataByTaskId, getCollectResult } from '../../api';
    import bus from '../common/bus';

    function isStrEmpty(obj) {
        return typeof obj == 'undefined' || obj == null || obj === '';
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
                editVisible: false,
                detailText: '',
                pageTotal: 0,
                form: {},
                idx: -1,
                id: -1
            };
        },
        created() {
            this.getData();
        },
        methods: {
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
