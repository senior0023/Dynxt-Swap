<template>
    <div :style="{ 'height': elHeight }" style="width: 100%">
    </div>
</template>

<script>
    export default {
        name: "empty-block",
        props: {
            info: {
                type: Object,
                default: () => {
                }
            }
        },
        computed:{
            elHeight(){
                if(this.$vuetify.breakpoint.lgAndUp){
                    return this.info.desktop.toString()+'px'
                }else if(this.$vuetify.breakpoint.md){
                    return this.info.tablet.toString()+'px'
                }else{
                     return this.info.mobile.toString()+'px'
                }
            }
        }
    }
</script>

<style scoped>

</style>
