<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 文件管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                        type="primary"
                        icon="el-icon-delete"
                        class="handle-del mr10"
                        @click="delAllSelection"
                >批量删除
                </el-button>
                <el-button
                        type="primary"
                        icon="el-icon-download"
                        class="handle-download mr10"
                        @click="downloadAllSelection"
                >批量下载
                </el-button>
                <!--====================下拉筛选==========================================-->
                <el-select v-model="filter.fileStatus" placeholder="文件状态筛选" @change="changeFileFilter"
                           class="handle-select mr10">
                    <el-option v-for="(item, index) in this.fileStatusFilters" :key="index" :label="item.text"
                               :value="item.text"></el-option>
                </el-select>
                <el-select v-model="filter.fileType" placeholder="文件类型筛选" @change="changeFileFilter"
                           class="handle-select mr10">
                    <el-option v-for="(item, index) in this.fileTypeFilters" :key="index" :label="item.text"
                               :value="item.text"></el-option>
                </el-select>
                <el-input v-model="conditionParam.patientId" placeholder="被试id" class="handle-input mr10"></el-input>
                <el-input v-model="conditionParam.collectId" placeholder="采集轮次id" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">检索</el-button>
            </div>
            <!--            <el-button-->
            <!--                    type="primary"-->
            <!--                    icon="el-icon-delete"-->
            <!--                    class="handle-del mr10"-->
            <!--                    @click="delAll"-->
            <!--            >全部删除-->
            <!--            </el-button>-->
            <!--            <el-button-->
            <!--                    type="primary"-->
            <!--                    icon="el-icon-download"-->
            <!--                    class="handle-download mr10"-->
            <!--                    @click="downloadAll"-->
            <!--            >全部下载-->
            <!--            </el-button>-->
            <el-table
                    :data="curPageData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <!--prop的名字与data中绑定即可显示对应字段值-->
                <el-table-column width="100" prop="collectId" label="采集轮次id" align="center"></el-table-column>
                <el-table-column width="100" prop="patientId" label="被试id" align="center"></el-table-column>
                <el-table-column width="100" prop="patientName" label="被试姓名" align="center"></el-table-column>
                <el-table-column width="150" prop="task" label="任务" align="center"></el-table-column>
                <el-table-column width="80" prop="fileType" label="文件类型" align="center">
                    <!--                    <template slot-scope="scope">￥{{scope.row.money}}</template>-->
                </el-table-column>
                <el-table-column prop="fileName" label="文件名" align="center"></el-table-column>
                <el-table-column width="100" prop="fileSize" label="文件大小" align="center"></el-table-column>
                <el-table-column width="190" prop="lastModifiedTime" label="最后修改时间"
                                 align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-view"
                                @click="handleView(scope.row)"
                        >查看
                        </el-button>
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.row)"
                        >删除
                        </el-button>
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

        <!-- 编辑弹出框 -->
        <!--        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">-->
        <!--            &lt;!&ndash;            <el-form ref="form" :model="form" label-width="70px">&ndash;&gt;-->
        <!--            &lt;!&ndash;                <el-form-item label="用户名">&ndash;&gt;-->
        <!--            &lt;!&ndash;                    <el-input v-model="form.name"></el-input>&ndash;&gt;-->
        <!--            &lt;!&ndash;                </el-form-item>&ndash;&gt;-->
        <!--            &lt;!&ndash;                <el-form-item label="地址">&ndash;&gt;-->
        <!--            &lt;!&ndash;                    <el-input v-model="form.address"></el-input>&ndash;&gt;-->
        <!--            &lt;!&ndash;                </el-form-item>&ndash;&gt;-->
        <!--            &lt;!&ndash;            </el-form>&ndash;&gt;-->
        <!--            <span slot="footer" class="dialog-footer">-->
        <!--                <el-button @click="editVisible = false">取 消</el-button>-->
        <!--                <el-button type="primary" @click="saveEdit">确 定</el-button>-->
        <!--            </span>-->
        <!--        </el-dialog>-->
        <!--等待框-->
        <el-dialog title="提示" :visible.sync="editVisible" width="30%">
            <div style="alignment: center">
                <h2>请稍等...</h2>
            </div>
            <!--            <el-form ref="form" :model="form" label-width="70px">-->
            <!--                <el-form-item label="用户名">-->
            <!--                    <el-input v-model="form.name"></el-input>-->
            <!--                </el-form-item>-->
            <!--                <el-form-item label="地址">-->
            <!--                    <el-input v-model="form.address"></el-input>-->
            <!--                </el-form-item>-->
            <!--            </el-form>-->
            <!--            <span slot="footer" class="dialog-footer">-->
            <!--                <el-button @click="editVisible = false">取 消</el-button>-->
            <!--                <el-button type="primary" @click="saveEdit">确 定</el-button>-->
            <!--            </span>-->
        </el-dialog>
    </div>
</template>

<script>
    import { fetchData } from '../../api/index';
    import { deleteFile } from '../../api/index';
    import { downloadFile } from '../../api';

    function isStrEmpty(obj) {
        return typeof obj == 'undefined' || obj == null || obj === '';
    }

    function noFilterCondition(fileFilterStr) {
        return isStrEmpty(fileFilterStr) || '全部' === fileFilterStr;
    }

    function arrayContains(array, item) {
        let len = array.length;
        for (let i = 0; i < len; i++) {
            if (array[i] === item) {
                return true;
            }
        }
        return false;
    }


    const maxShowNumPerPage = 10;
    export default {
        name: 'basetable',
        data() {
            return {
                filter: {
                    // 文件使用状态（有效文件、无效文件）
                    fileStatus: '',
                    fileType: ''
                },
                conditionParam: {
                    // -1 表示invalid
                    patientId: '',
                    collectId: ''
                },
                query: {
                    address: '',
                    name: '',
                    pageIndex: 1,
                    pageSize: maxShowNumPerPage
                },
                fileStatusFilters: [
                    {
                        text: '全部'
                    },
                    {
                        text: '有效文件'
                    },
                    {
                        text: '无效文件'
                    }
                ],
                fileTypeFilters: [
                    {
                        text: '全部'
                    },
                    {
                        text: '.txt'
                    },
                    {
                        text: '.pdf'
                    },
                    {
                        text: '.zip'
                    },
                    {
                        text: '其他'
                    }
                ],
                curPageData: [],
                receivedData: [],
                filteredData: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,
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
                fetchData(this.conditionParam).then(res => {
                    if (res.code === 200) {
                        let totalData = res.data;
                        if (totalData) {
                            this.receivedData = totalData;
                            this.filter.fileType = '';
                            this.filter.fileStatus = '';
                        }
                    }
                    this.filteredData = this.receivedData;
                    this.pageTotal = this.filteredData.length;
                    this.query.pageIndex = 1;
                    this.refreshPageData(1);
                });
            },
            changeFileFilter() {
                let status = this.filter.fileStatus;
                let type = this.filter.fileType;
                let temp = [];
                let len = this.receivedData.length;
                for (let i = 0; i < len; i++) {
                    let item = this.receivedData[i];
                    let fileStatusCond
                        = noFilterCondition(status) || (status === '有效文件' && true === item.referred) || ((status === '无效文件' && false === item.referred));
                    let types = ['.pdf', '.txt', '.zip'];
                    let itemFileType = '.' + item.fileType.substr(1).toLowerCase();
                    let fileTypeCond
                        = noFilterCondition(type) || (type === itemFileType) || (type === '其他' && !arrayContains(types, itemFileType));
                    if (fileStatusCond && fileTypeCond) {
                        temp.push(item);
                    }
                }
                this.filteredData = temp;
                this.pageTotal = this.filteredData.length;
                this.query.pageIndex = 1;
                this.refreshPageData(this.query.pageIndex);
            },
            afterDeleteFile(deleteFileArray) {
                if (deleteFileArray.length === this.receivedData.length) {
                    //说明是全部删除
                    this.receivedData = [];
                } else {
                    let tmp = [];
                    let l = this.receivedData.length;
                    for (let i = 0; i < l; i++) {
                        let cur = this.receivedData[i];
                        let find = false;
                        let len = deleteFileArray.length;
                        for (let j = 0; j < len; j++) {
                            if (deleteFileArray[j].order === cur.order) {
                                find = true;
                                break;
                            }
                        }
                        if (!find) {
                            tmp.push(cur);
                        }

                    }
                    this.receivedData = tmp;
                }
                // 重新在按照过滤条件过滤文件
                this.changeFileFilter();
                this.refreshPageData(this.query.pageIndex);

            },
            // 刷新pageIndex页的展示数据
            refreshPageData(pageIndex) {
                let start = maxShowNumPerPage * (pageIndex - 1);
                this.curPageData = this.filteredData.slice(start, start + maxShowNumPerPage);
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageIndex', 1);
                // 模拟根据检索条件从服务端获取到数据
                this.getData();
            },

            // 多选操作
            handleSelectionChange(val) {
                // console.log(val);
                this.multipleSelection = val;
            },
            delAllSelection() {
                // 调用删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        let needToDeleteFileArray = this.multipleSelection;
                        deleteFile(needToDeleteFileArray).then(res => {
                            if (res.code === 200) {
                                this.afterDeleteFile(needToDeleteFileArray);
                                // this.receivedData.splice(index, 1);
                                this.$message.success('删除成功');
                                this.multipleSelection = [];
                            } else {
                                this.$message.success('删除失败');
                            }
                        });
                    })
                    .catch(() => {
                        this.$message.success('删除失败');
                    });
            },
            // 批量下载
            downloadAllSelection() {
                // console.log(this.multipleSelection);
                this.editVisible = true;
                downloadFile(this.multipleSelection)
                    .then(res => {
                        if (res.code === 200 && !isStrEmpty(res.data)) {
                            // 定位到返回的链接
                            window.open(res.data, '_blank');
                        } else {
                            this.$message.success('失败');
                        }
                        this.editVisible = false;
                    }).catch(e => {
                    this.editVisible = false;
                });
            },
            delAll() {
                // // 二次确认删除
                // this.$confirm('确定要删除吗？', '提示', {
                //     type: 'warning'
                // })
                //     .then(() => {
                //         // this.afterDeleteFile(this.filteredData);
                //         // // this.receivedData.splice(index, 1);
                //         // this.$message.success('删除成功');
                //         // deleteFile(this.filteredData).then(res => {
                //         //     if (res.code === 200) {
                //         //         this.afterDeleteFile(this.filteredData);
                //         //         // this.receivedData.splice(index, 1);
                //         //         this.$message.success('删除成功');
                //         //     }
                //         // });
                //
                //     })
                //     .catch(() => {
                //     });
                //
                // // this.afterDeleteFile(this.filteredData);
                // // // this.receivedData.splice(index, 1);
                // // this.$message.success('删除成功');
            },
            downloadAll() {
                // this.editVisible = true;
                // downloadFile(this.filteredData, 50000).then(res => {
                //     if (res.code === 200 && !isStrEmpty(res.data)) {
                //         // 定位到返回的链接
                //         window.open(res.data, '_blank');
                //     } else {
                //         this.$message.success('失败');
                //     }
                //     this.editVisible = false;
                // }).catch(e=>{
                //     this.editVisible = false;
                // });
            },

            // 编辑操作
            handleView(row) {
                window.open(row.fileUrlPath, '_blank');
            },
            // 删除操作
            handleDelete(row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        let list = [row];
                        deleteFile(list).then(res => {
                            if (res.code === 200) {
                                this.afterDeleteFile(list);
                                // this.receivedData.splice(index, 1);
                                this.$message.success('删除成功');
                            } else {
                                this.$message.success('删除失败');
                            }
                        });
                    })
                    .catch(() => {
                        this.$message.success('删除失败');
                    });
            },
            // 保存编辑
            saveEdit() {
                this.editVisible = false;
                this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                this.$set(this.receivedData, this.idx, this.form);
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
        width: 100px;
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
