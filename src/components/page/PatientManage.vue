<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 患者管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                        type="primary"
                        icon="el-icon-circle-plus"
                        class="handle-add mr10"
                        @click="addPatient"
                >新增用户
                </el-button>

                &emsp;&emsp;

                <el-input v-model="conditionParam.patientId" placeholder="输入患者id进行查询" class="handle-input mr10"></el-input>
<!--                <el-input v-model="conditionParam.collectId" placeholder="采集轮次id" class="handle-input mr10"></el-input>-->
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
                <el-table-column width="100" prop="id" label="被试id" align="center"></el-table-column>
                <el-table-column width="100" prop="patientName" label="被试姓名" align="center"></el-table-column>
                <el-table-column width="100" prop="age" label="年龄" align="center"></el-table-column>
                <el-table-column width="100" prop="gender" label="性别" align="center"></el-table-column>
                <el-table-column width="100" prop="height" label="身高" align="center"></el-table-column>
                <el-table-column width="100" prop="weight" label="体重" align="center"></el-table-column>
                <el-table-column width="120" prop="adhdType" label="当前诊断类型" align="center"></el-table-column>
                <el-table-column width="120" label="主诉" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="showDetailInfo(scope.row.clinicalInfo, 'chiefComplaint')">查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column width="120" label="现病史" align="center">
                    <template slot-scope="scope">
                        <el-button type="success" @click="showDetailInfo(scope.row.clinicalInfo, 'presentIllnessHistory')">查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column width="120" label="症状持续时间" align="center">
                    <template slot-scope="scope">
                        <el-button type="info" @click="showDetailInfo(scope.row.clinicalInfo, 'symptomTime')">查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column width="120" label="治疗史" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="showDetailInfo(scope.row.clinicalInfo,'treatmentHistory')">查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column width="120" label="既往史" align="center">
                    <template slot-scope="scope">
                        <el-button type="success" @click="showDetailInfo(scope.row.clinicalInfo, 'pastHistory')">查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column width="120" label="个人史" align="center">
                    <template slot-scope="scope">
                        <el-button type="info" @click="showDetailInfo(scope.row.clinicalInfo, 'personalHistory')">查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column width="120" label="家族史" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="showDetailInfo(scope.row.clinicalInfo, 'familyHistory')">查看</el-button>
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
    import { fetchData } from '../../api/index';
    import { deleteFile } from '../../api/index';
    import { downloadFile, fetchPatientBasicInfo } from '../../api';

    function isStrEmpty(obj) {
        return typeof obj == 'undefined' || obj == null || obj === '';
    }

    const maxShowNumPerPage = 10;
    export default {
        name: 'patientTable',
        data() {
            return {
                conditionParam: {
                    patientId: "",
                },
                query: {
                    address: '',
                    name: '',
                    pageIndex: 1,
                    pageSize: maxShowNumPerPage
                },
                curPageData: [],
                receivedData: [
                    // private String id;
                    //
                    // private String name;
                    //
                    // private String gender;
                    //
                    // private String age;
                    //
                    // private String weight;
                    //
                    // private String height;
                    //
                    // private String adhdType;
                    //
                    // private ClinicalInfoVO clinicalInfo;
                    // {
                    //     patientId: "1",
                    //     patientName: "wang",
                    //     chiefComplaint:"123"
                    // },
                    // {
                    //     patientId: "2",
                    //     patientName: "zhang",
                    //     chiefComplaint: "23444"
                    // }
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

                fetchPatientBasicInfo().then(res => {
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
            showDetailInfo(clinicalInfo, item){
                let text = "";
                if (clinicalInfo !== undefined && clinicalInfo != null && clinicalInfo[item] !== undefined) {
                    text = clinicalInfo[item];
                }
                this.detailText = text;
                this.editVisible = true;
            },
            // 刷新pageIndex页的展示数据
            refreshPageData(pageIndex) {
                let start = maxShowNumPerPage * (pageIndex - 1);
                this.curPageData = this.receivedData.slice(start, start + maxShowNumPerPage);
            },
            // 触发搜索按钮
            handleSearch() {
                // this.getData();
                if (isStrEmpty(this.conditionParam.patientId)) {
                    this.query.pageIndex = 1;
                    this.pageTotal = this.receivedData.length;
                    this.refreshPageData(1);
                } else {
                    this.$set(this.query, 'pageIndex', 1);
                    let temp = [];
                    let len = this.receivedData.length;
                    for(let i = 0; i < len; i++) {
                        if (this.receivedData[i].id === this.conditionParam.patientId.trim()) {
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
        width: 150px;
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
