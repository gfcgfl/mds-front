<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 诊断流程-时间流
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">

                <!--====================下拉筛选==========================================-->

                <el-input v-model="conditionParam.patientId" placeholder="输入被试（患者）id"
                          class="handle-input mr10"></el-input>
                <!--                <el-input v-model="conditionParam.collectId" placeholder="采集轮次id" class="handle-input mr10"></el-input>-->
                <el-button type="primary" icon="el-icon-search" @click="getTimeFlow">生成</el-button>
            </div>

            <div class="flows">

                <flow-bar v-for="(item, index) in this.timeflowEvents" :timeflow-event="item" :key="index"></flow-bar>

            </div>


        </div>


    </div>
</template>

<script>

    import flowBar from './FlowBar';
    import { fetchData, fetchTimeFLowEvent } from '../../api';

    function isStrEmpty(obj) {
        return typeof obj == 'undefined' || obj == null || obj === '';
    }

    export default {
        name: 'TimeFlow',
        components: { flowBar },
        data() {
            return {
                conditionParam: {
                    // -1 表示invalid
                    patientId: '',
                    collectId: ''
                },
                timeflowEvents: [
                    // {
                    //     patientId: 10,
                    //     valid: true,
                    //     startTime: '2010-01-01',
                    //     describe: 'do something',
                    //     innerFlow: [
                    //         {
                    //             patientId: 10,
                    //             valid: true,
                    //             startTime: '2010-01-01',
                    //             describe: 'do something xxx',
                    //             innerFlow: []
                    //         },
                    //         {
                    //             patientId: 10,
                    //             valid: true,
                    //             startTime: '2010-01-01',
                    //             describe: 'do something xyy',
                    //             innerFlow: []
                    //         }
                    //     ]
                    //
                    // },
                    // {
                    //     patientId: 10,
                    //     valid: true,
                    //     startTime: '2010-01-02',
                    //     describe: 'do something',
                    //     innerFlow: [
                    //         {
                    //             patientId: 10,
                    //             valid: true,
                    //             startTime: '2010-01-02',
                    //             describe: 'do something xxx2',
                    //             innerFlow: []
                    //         },
                    //         {
                    //             patientId: 10,
                    //             valid: true,
                    //             startTime: '2010-01-02',
                    //             describe: 'do something xyy2',
                    //             innerFlow: []
                    //         }
                    //     ]
                    //
                    // }
                ]
            };
        },
        created() {

        },
        methods: {
            getTimeFlow() {
                if (isStrEmpty(this.conditionParam.patientId)) {
                    this.$message.error('指定患者id');
                    return;
                }
                fetchTimeFLowEvent(this.conditionParam.patientId).then(res => {
                    if (res.code === 200) {
                        this.timeflowEvents = res.data;
                    }
                    // console.log(this.timeflowEvents);

                });
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
