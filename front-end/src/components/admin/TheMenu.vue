<template>
  <a-layout-sider v-model:collapsed="collapsed" collapsible>
    <div class="text-white py-4 px-4">Trang Quản trị</div>
    <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
      <a-menu-item key="admin-users" @click="navigateTo('admin-users')">
        <pie-chart-outlined />
        <span>Quan ly users</span>
      </a-menu-item>
      <a-menu-item
        key="admin-categories"
        @click="navigateTo('admin-categories')"
      >
        <desktop-outlined />
        <span>Quan ly the loai</span>
      </a-menu-item>
      <a-sub-menu key="sub1">
        <template #title>
          <span>
            <user-outlined />
            <span>User</span>
          </span>
        </template>
        <a-menu-item key="3">Tom</a-menu-item>
        <a-menu-item key="4">Bill</a-menu-item>
        <a-menu-item key="5">Alex</a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub2">
        <template #title>
          <span>
            <team-outlined />
            <span>Team</span>
          </span>
        </template>
        <a-menu-item key="6">Team 1</a-menu-item>
        <a-menu-item key="8">Team 2</a-menu-item>
      </a-sub-menu>
      <a-menu-item key="9">
        <file-outlined />
        <span>File</span>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>
<script>
import { ref, onMounted, defineComponent } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useMenu } from "../../stores/use-menu.js";

export default defineComponent({
  setup(_, { emit }) {
    const collapsed = ref(false);
    const router = useRouter();
    const store = useMenu();

    const { selectedKeys, openKeys } = storeToRefs(store);
    const navigateTo = (routeName) => {
      selectedKeys.value = [routeName];
      emit("update:selectedKeys", selectedKeys.value);
      router.push({ name: routeName }).catch(() => {});
    };
    onMounted(() => {
      if (!selectedKeys.value.length) {
        navigateTo("admin-users");
      }
    });
    return { collapsed, navigateTo, selectedKeys };
  },
});
</script>
