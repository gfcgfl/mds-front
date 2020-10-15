<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i>采集页</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container0">
            <el-form :model="collectVO" :rules="rules">
                <el-form-item label="患者编号" prop="patientId">
                    <el-input v-model="collectVO.patientId" autocomplete="off" class="formInput"></el-input>
                </el-form-item>
                <el-form-item label="医师编号">
                    <el-input v-model="collectVO.doctorId" autocomplete="off" class="formInput"></el-input>
                </el-form-item>
                <template>
                    <span class="demonstration">任务选择</span>
                    <el-checkbox-group v-model="operateTasks">
                        <el-checkbox v-for="(item,index) in this.availableTasks" :label="item.name"
                                     :key="item + index"></el-checkbox>
                    </el-checkbox-group>
                </template>
                <div class="block">
                    <span class="demonstration">采集开始时间</span>
                    <el-date-picker
                            value-format="yyyy-MM-dd HH:mm:ss"
                            v-model="collectVO.startTime"
                            type="datetime"
                            placeholder="选择日期时间">
                    </el-date-picker>
                </div>
                <el-form-item label="新建的采集ID">
                    <el-input v-model="collectId" autocomplete="off" class="formInput" disabled></el-input>
                </el-form-item>
                <el-button type="primary" @click="newCollect">新建采集</el-button>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="newCollect">新建采集</el-button>
                </div>
            </el-form>
        </div>
        <div v-for="(task, index) in choseTasks" :key="index" class="container" :disabled="forbidCollectInfoInput">
            <span>任务{{task.taskId}}：</span>
            <span>{{task.name}}</span>


            <el-upload
                    action=""
                    class="upload-demo"
                    :before-upload="(_file)=>{
                        return beforeUpload(_file,task.taskId);
                    }"
                    :limit="1">
                <el-button size="small" type="primary">点击上传BIN文件</el-button>
                <!--                <div slot="tip" class="el-upload__tip">只能上传.bin文件</div>-->
            </el-upload>
            <!--            <el-upload-->
            <!--                    action=""-->
            <!--                    list-type="picture-card"-->
            <!--                    :before-upload="beforeUpload">-->
            <!--                <i class="el-icon-plus" style="size: A5"></i>-->
            <!--            </el-upload>-->


            <el-form>
                <el-form-item v-for="(item, i_index) in task.items" :key="i_index" :label="item.chineseName">
                    <el-input v-model="taskItemMap[item.englishName]" autocomplete="off" class="formInput"></el-input>
                </el-form-item>

            </el-form>


            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submit(task.taskId)">提交</el-button>
            </div>
        </div>
    </div>
</template>

<script>

    import { addTaskForBinFile, newCollect } from '../../api';
    import { TASK_ITEM } from '../../const/constant';

    function isInArray(arr, value) {
        for (let i = 0; i < arr.length; i++) {
            if (value === arr[i]) {
                return true;
            }
        }
        return false;
    }

    export default {
        name: 'collectionPage',
        data() {
            return {
                collectVO: {
                    // id:"",
                    patientId: '',
                    doctorId: '',
                    startTime: '',
                    // endTime:"",
                    // createTime:"",
                    operateTaskId: null
                },
                availableTasks: [],
                choseTasks: [],
                taskItemMap: {},
                collectId: '',
                file: null,
                forbidCollectInfoInput: false,
                operateTasks: [],
                rules: {
                    patientId: [
                        { required: true, message: '必填患者id', trigger: 'blur' }
                    ]
                },
                // key : taskId   value: file
                uploadedFiles: {},
                taskName2IdMap: {}
            };
        },
        methods: {
            taskName2Id() {
                let tmp = {};
                this.availableTasks.forEach(task => tmp[task.name] = task.taskId);
                return tmp;
            },
            // reset() {
            //     this.choseTasks = [];
            //     this.operateTasks = [];
            //     this.taskItemMap = {};
            //     this.collectId = '';
            //     this.uploadedFiles = {};
            // },
            newCollect() {
                if (this.collectVO.patientId && this.collectVO.startTime) {
                    // 修改时间格式
                    let operateTaskIds = [];
                    let a = this.taskName2IdMap;
                    this.operateTasks.forEach(taskName => operateTaskIds.push(a[taskName]));
                    if (operateTaskIds.length < 1) {
                        this.$message.error('必须指定task名称');
                        return;
                    }
                    this.collectVO.operateTaskId = operateTaskIds;
                    newCollect(this.collectVO).then(res => {
                        if (res.code === 200) {
                            this.collectId = res.data.toString();
                            this.choseTasks = [];
                            this.availableTasks.forEach(task => {
                                if (isInArray(operateTaskIds, task.taskId)) {
                                    this.choseTasks.push(task);
                                }
                            });
                        }
                    });
                }

            },
            beforeUpload(_file, taskId) {
                // console.log(_file);
                if (_file.name.substr(_file.name.lastIndexOf('.') + 1).toLowerCase() !== 'bin') {
                    this.$message.error('没有指定bin文件');
                    return false;
                }
                this.uploadedFiles[taskId] = _file;
                return false;
            },
            submit(task_Id) {
                let patientId = parseInt(this.collectVO.patientId);
                let collectId = parseInt(this.collectId);
                let taskId = parseInt(task_Id);
                let data = {};
                data['patientId'] = patientId;
                data['collectId'] = collectId;
                data['taskId'] = taskId;
                data['data'] = this.taskItemMap;

                let file = this.uploadedFiles[task_Id];
                if (!file) {
                    this.$message.error('没有指定bin文件');
                    return;
                }

                addTaskForBinFile(data, file).then(res => {
                    if (res.code === 200) {
                        //提交成功后将taskItemMap 和file缓存清空
                        // this.taskItemMap = {};
                        // this.uploadedFiles[task_Id] = null;
                        this.$message.success('提交成功');
                    } else {
                        this.$message.error('提交失败');
                    }
                });


            }
        },
        computed: {},
        created() {
            this.availableTasks = TASK_ITEM;
            this.taskName2IdMap = this.taskName2Id();

            // this.availableTasks.forEach(task => {
            //     // 用于存储每个任务item的数据接口，以taskId为key
            //     this.taskItemMap[task.taskId] = {};
            // });

        }
    };

</script>

<style scoped>
    .formInput {
        max-width: 100px;
    }

    .upload-demo {
        max-width: 50px;
    }
</style>

