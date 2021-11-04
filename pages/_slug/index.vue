<template>
  <div class="black">
    <div v-if="page" class="pl-md-70">
      <div v-for="(item,idx) in page.blocks" :key="idx" class="vault">
        <banner-slider :info="item" v-if="item.__component === 'page-blocks.block-hero'" id="home"></banner-slider>
        <block-coin :info="item" v-else-if="item.__component === 'page-blocks.block-coin'"></block-coin>
        <block-intro :info="item" v-else-if="item.__component === 'page-blocks.block-intro'" id="vaults" ></block-intro>
        <team-member :info="item" v-else-if="item.__component === 'page-blocks.block-team'" id="team"></team-member>
        <task-stepper :info="item" v-else-if="item.__component === 'page-blocks.block-roadmap'"
                      id="roadmap"></task-stepper>
        <register-block :info="item" v-else-if="item.__component === 'page-blocks.block-register'"
                      id="register"></register-block>
        <empty-block :info="item" v-else-if="item.__component === 'page-blocks.block-empty-space'"></empty-block>
      </div>
    </div>
    <div v-else>
      <div class="text-center text-h2 error--text my-12 py-12 pl-md-70">
        Page Not Found.
      </div>
    </div>
  </div>
</template>
<script>
    import BannerSlider from "~/components/pageBlocks/banner-slider";
    import TaskStepper from "~/components/pageBlocks/task-stepper";
    import {mapGetters} from 'vuex'
    import TeamMember from "~/components/pageBlocks/team-member";
    import BlockCoin from "~/components/pageBlocks/block-coin";
    import BlockIntro from "~/components/pageBlocks/block-intro";
    import RegisterBlock from "~/components/pageBlocks/register-block";
    import EmptyBlock from "../../components/pageBlocks/empty-block";
    export default {
        components: {
            EmptyBlock, RegisterBlock, BlockIntro, BlockCoin, TeamMember, TaskStepper, BannerSlider},
        computed: {
            ...mapGetters(['getPages']),
            page() {
                var slug = this.$route.params.slug;
                return this.getPages.find(com => com.slug === slug)
            },
        }
    }
</script>
