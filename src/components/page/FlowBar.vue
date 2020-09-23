<template>
    <div class="flow">
        <div>
            <el-alert :title="timeflowEvent.describe" type="success" :closable="false" effect="dark"></el-alert>
        </div>
        <div v-show="isShow" class="subFlow" style="margin-top:10px">
            <el-alert v-for="(item, index) in this.timeflowEvent.innerFlow" :title="item.describe" type="info" style="margin-top:10px; margin-left: 50px" :key="index"
                      :closable="false"></el-alert>
        </div>
        <br>

    </div>
</template>

<script>
    export default {
        name: 'FlowBar',
        props: ['timeflowEvent'],
        data() {
            return {

            };
        },
        computed: {
            isShow: function() {
                // console.log(this.timeflowEvent);
                let inner = this.timeflowEvent.innerFlow;
                // console.log(inner);
                return inner !== undefined && inner != null && inner.length > 0;
            }
        }
    };
</script>

<style scoped>

</style>