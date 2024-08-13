<template>
    <div class="container mt-4">
        <div class="row d-flex justify-content-center">
            <!-- Sidebar Component -->
            <Sidebar />
            <!-- Content Component -->
            <div class="col-md-7 content border border-dark">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>
<script>
import Sidebar from '@/components/client/profile/sidebar.vue';
export default {
    components:{
        Sidebar,
    },
    setup(){
        return {

        }
    }
}
</script>

<style scoped>
@import '../../assets/css/profile.css';
</style>