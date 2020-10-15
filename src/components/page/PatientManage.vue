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



        <!-- 新增用户  -->
        <el-dialog title="新增患者" :visible.sync="addPatientFormVisible">
            <el-form :model="patientForm" :rules="rules">
                <el-divider content-position="left"><h5 style="color: #666666">基本信息</h5></el-divider>
                <el-form-item label="编号" prop="patientId">
                    <el-input v-model="patientForm.id" autocomplete="off" class="formInput" ></el-input>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="patientForm.name" autocomplete="off" class="formInput"></el-input>
                </el-form-item>
                <el-form-item label="年龄">
                    <el-input v-model="patientForm.age" autocomplete="off" class="formInput"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-select v-model="patientForm.gender" placeholder="请选择" class="formInput">
                        <el-option label="男" value="0"></el-option>
                        <el-option label="女" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="身高">
                    <el-input v-model="patientForm.height" autocomplete="off" class="formInput"></el-input>
                </el-form-item>
                <el-form-item label="体重">
                    <el-input v-model="patientForm.weight" autocomplete="off" class="formInput"></el-input>
                </el-form-item>
                <el-form-item label="诊断类型">
                    <el-select v-model="patientForm.adhdType" placeholder="类型选择" style="max-width: 200px">
                        <el-option label="正常" value="0"></el-option>
                        <el-option label="注意缺陷性（ADHD-I）" value="1"></el-option>
                        <el-option label="多动冲动型（ADHD-HI）" value="2"></el-option>
                        <el-option label="混合型（ADHD-C）" value="3"></el-option>
                        <el-option label="不指定" value="-1"></el-option>
                    </el-select>
                </el-form-item>
                <el-divider content-position="left"><h5 style="color: #666666">干预信息</h5></el-divider>

                <el-form-item label="用药">
                    <el-select v-model="patientForm.medicine" placeholder="药物选择" style="max-width: 200px">
                        <el-option v-for="(medicine, index) in this.medicineList" :key="index" :label="medicine" :value="medicine"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="其他治疗/干预手段">
                    <el-input v-model="patientForm.intervene" autocomplete="off"></el-input>
                </el-form-item>

                <el-divider content-position="left"><h5 style="color: #666666">临床信息</h5></el-divider>
                <el-form-item label="症状持续时间（月）">
                    <el-input v-model="patientForm.clinicalInfo.symptomTime" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="主诉">
                    <el-input v-model="patientForm.clinicalInfo.chiefComplaint" type="textarea" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="现病史（患者病后的全过程,即发生、发展、演变和诊治经过)">
                    <el-input v-model="patientForm.clinicalInfo.presentIllnessHistory" type="textarea" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="既往史（高热惊厥？癫痫？鼻炎？扁桃体炎？头颅外伤？手术？食物、药物过敏史？）">
                    <el-input v-model="patientForm.clinicalInfo.pastHistory" type="textarea" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="个人史（父母高龄？母孕期？早产？产伤？缺氧？黄疸？走路、说话等发育情况？）">
                    <el-input v-model="patientForm.clinicalInfo.personalHistory" type="textarea" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="家族史（某家属罹患何种疾病）">
                    <el-input v-model="patientForm.clinicalInfo.familyHistory" type="textarea" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addPatientFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="insert">添加</el-button>
            </div>
        </el-dialog>


        <!--文本框-->
        <el-dialog title="详情" :visible.sync="editVisible" width="30%">
            <div style="alignment: center">
                {{detailText}}
            </div>
        </el-dialog>
    </div>
</template>

<script>

    import {getMedicineList, insertPatient , fetchPatientBasicInfo } from '../../api';

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
                ],
                multipleSelection: [],
                addPatientFormVisible: false,
                editVisible: false,
                detailText: '',
                pageTotal: 0,
                size: '50px',
                patientForm: {
                    id: "",
                    name: "",
                    gender: "",
                    age:"",
                    weight:"",
                    height:"",
                    adhdType:"",
                    medicine:"",
                    intervene:"",
                    doctorName:"",
                    exists:"",
                    clinicalInfo: {
                        patientId:"",
                        chiefComplaint:"",
                        presentIllnessHistory:"",
                        symptomTime:"",
                        treatmentHistory:"",
                        pastHistory:"",
                        personalHistory:"",
                        familyHistory:"",
                        treatmentProposal:"",
                    }
                },
                rules: {
                    patientId: [
                        { required: true, message: '必填患者id', trigger: 'blur' }
                    ]
                },
                medicineList:[],
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
                            totalData.forEach(data => {
                               data.gender = data.gender === '0' ? '男' : (data.gender === "1" ? '女' : '未知');
                            });
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
                this.addPatientFormVisible = true;
                // 发请求获取medicine列表
                if (this.medicineList.length === 0) {
                    getMedicineList().then(res => {
                        if (res) {
                            this.medicineList = res;
                        }
                    })
                }
            },
            insert() {
                this.patientForm.exists = "false";
                this.patientForm.clinicalInfo.patientId = this.patientForm.id;
                insertPatient(this.patientForm).then(res => {
                    if (res.code === 200) {
                        this.$message.success('添加成功');
                        this.addPatientFormVisible = false;
                    } else {
                        this.$message.error('失败');
                        this.addPatientFormVisible = true;
                    }
                })
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

    .formInput {
        max-width: 100px;
    }
</style>
