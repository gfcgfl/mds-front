<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 模型训练与分析</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs v-model="message">
                <el-tab-pane :label="`BrainNet 脑网络模型`" name="first">
                    <div class="wrapper">
                        <div class="left">
                            <el-form :label-position="labelPosition" label-width="120px" :model="formLabelAlign">
                                <el-form-item label="选择：">
                                    <el-checkbox-group v-model="formLabelAlign.checkList">
                                        <el-checkbox label="采集数据" disabled></el-checkbox>
                                        <el-checkbox label="诊疗数据"></el-checkbox>
                                    </el-checkbox-group>
                                </el-form-item>
                                <el-form-item label="迭代模型选择：">
                                    <el-select v-model="value" placeholder="请选择">
                                        <el-option v-for="item in options" :key="item.value" :label="item.label"
                                                   :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="最大迭代次数：">
                                    <el-input v-model="maxIterationCount" placeholder="default: 1000"></el-input>
                                </el-form-item>
                                <el-form-item label="训练样本占比：">
                                    <el-input v-model="trainProportion" placeholder="default: 0.7"></el-input>
                                </el-form-item>
                            </el-form>
                            <el-button type="primary" @click="handleTrainingStart">开始训练</el-button>
                        </div>
                        <div class="right">
                            <el-table :data="tableDataLeft" style="width: 100%">
                                <el-table-column prop="model" label="训练模型" width="140"></el-table-column>
                                <el-table-column prop="time" label="训练时间" width="140"></el-table-column>
                                <el-table-column prop="AUC" label="结果"></el-table-column>
                            </el-table>
                            <el-pagination class="pagination" background layout="prev, pager, next"
                                           :total="4"></el-pagination>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane :label="`DLPFC 识别模型`" name="second">
                    <div class="wrapper">
                        <div class="left">
                            <el-form :label-position="labelPosition" label-width="120px" :model="formLabelAlign">
                                <el-form-item label="选择：">
                                    <el-checkbox-group v-model="formLabelAlign.checkList">
                                        <el-checkbox label="采集数据" disabled></el-checkbox>
                                        <el-checkbox label="诊疗数据"></el-checkbox>
                                    </el-checkbox-group>
                                </el-form-item>
                                <el-form-item label="迭代模型选择：">
                                    <el-select v-model="value" placeholder="请选择">
                                        <el-option v-for="item in options" :key="item.value" :label="item.label"
                                                   :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="最大迭代次数：">
                                    <el-input v-model="maxIterationCount" placeholder="default: 1000"></el-input>
                                </el-form-item>
                                <el-form-item label="训练样本占比：">
                                    <el-input v-model="trainProportion" placeholder="default: 0.7"></el-input>
                                </el-form-item>
                            </el-form>
                            <el-button type="primary" @click="handleTrainingStart">开始训练</el-button>
                        </div>
                        <div class="right">
                            <el-table :data="tableDataLeft" style="width: 100%">
                                <el-table-column prop="model" label="训练模型" width="140"></el-table-column>
                                <el-table-column prop="time" label="训练时间" width="140"></el-table-column>
                                <el-table-column prop="AUC" label="结果"></el-table-column>
                            </el-table>
                            <el-pagination class="pagination" background layout="prev, pager, next"
                                           :total="4"></el-pagination>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import bus from '../common/bus';
    import { getCollectDetailedData } from '../../api';

    function isStrEmpty(obj) {
        return typeof obj == 'undefined' || obj == null || obj === '';
    }

    export default {
        name: 'tabs',
        created() {
            bus.$on('gotoAnalysis', data => {
                this.curCollectId = data[0];
                this.curPatientId = data[1];
                this.refreshPage();
            });
        },
        data() {
            return {
                curCollectId: '',
                curPatientId: '',
                collectDetailedData: {},
                labelPosition: 'right',
                formLabelAlign: {
                    checkList: []
                },
                options: [
                    {
                        value: '树模型',
                        label: '树模型'
                    },
                    {
                        value: '线性模型',
                        label: '线性模型'
                    }
                ],
                value: '',
                maxIterationCount: '',
                trainProportion: '',
                tableDataLeft: [
                    {
                        model: 'xgboost',
                        time: '2020-09-23',
                        AUC: '0.874'
                    },
                    {
                        model: 'xgboost',
                        time: '2020-09-23',
                        AUC: '0.876'
                    },
                    {
                        model: 'xgboost',
                        time: '2020-09-23',
                        AUC: '0.870'
                    },
                    {
                        model: 'xgboost',
                        time: '2020-09-23',
                        AUC: '0.866'
                    }
                ]
            };
        },
        methods: {
            refreshPage() {
                let collectId = this.curCollectId;
                let patientId = this.curPatientId;
                if (isStrEmpty(collectId) || isStrEmpty(patientId)) {
                    this.$message.error("无效的collectId或patientId");
                    return;
                }
                this.refreshCollectDataShow(collectId, patientId);
            },
            refreshCollectDataShow(collectId, patientId) {
                getCollectDetailedData(collectId, patientId).then(res => {
                    if (res.code === 200) {
                        let data = res.data;
                        if (data != null) {
                            this.collectDetailedData = data;
                        }
                    }
                }).catch(err => {})
            },
            handleTrainingStart() {
                this.$message({
                    message: '恭喜你，训练成功！！',
                    type: 'success'
                });
            }
        },
        computed: {
            unreadNum() {
                return this.unread.length;
            }
        }
    };
</script>

<style>
    .message-title {
        cursor: pointer;
    }

    .handle-row {
        margin-top: 30px;
    }

    .wrapper {
        display: flex;
    }

    .left {
        width: 60%;
        border: 1px solid #e8e8e8;
        border-radius: 4px;
        padding: 30px;
    }

    .right {
        width: 40%;
        border: 1px solid #e8e8e8;
        border-radius: 4px;
        margin-left: 30px;
        padding: 30px;
    }

    .pagination {
        position: absolute;
        right: 0;
    }
</style>
