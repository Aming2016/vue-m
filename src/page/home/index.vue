<template>
  <div class="mine"></div>
</template>

<script>
export default {
  name: "Mine",
  created() {
    this.$store.dispatch("user/saveToken", { token: "fsafasfa" });
  },
};
</script>
<style lang="scss" scoped>
.mine {
  background: $color;
  height: 100vh;
  width: 375px;
}
</style>
