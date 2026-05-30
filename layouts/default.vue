<template>
  <div class="layout">
    <!-- 顶部导航 · 卷轴 -->
    <header class="header">
      <div class="header-inner">
        <NuxtLink to="/" class="brand">
          <span class="brand-seal">🐾</span>
          <span class="brand-text">小爪定时任务管理台</span>
        </NuxtLink>
        <nav class="nav">
          <NuxtLink to="/" class="nav-link" :class="{ active: route.path === '/' }">
            <span class="nav-icon">📊</span>
            <span>总览</span>
          </NuxtLink>
          <NuxtLink to="/jobs" class="nav-link" :class="{ active: route.path.startsWith('/jobs') }">
            <span class="nav-icon">📋</span>
            <span>任务</span>
          </NuxtLink>
          <NuxtLink to="/logs" class="nav-link" :class="{ active: route.path === '/logs' }">
            <span class="nav-icon">📜</span>
            <span>日志</span>
          </NuxtLink>
        </nav>
      </div>
    </header>

    <!-- 主内容 · 宣纸 -->
    <main class="main">
      <div class="container">
        <slot />
      </div>
    </main>

    <!-- 底部 · 落款 -->
    <footer class="footer">
      <div class="footer-inner">
        <span class="footer-seal">小爪 🐾</span>
        <span class="footer-divider">·</span>
        <span>东方文人风定时任务管理台</span>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ===== Header · 卷轴 ===== */
.header {
  background: var(--ink-deep);
  color: var(--paper-white);
  border-bottom: 3px solid var(--vermilion);
  position: sticky;
  top: 0;
  z-index: 100;
}
.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 3.5rem;
}
.brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  color: var(--paper-white);
}
.brand-seal {
  font-size: 1.4rem;
  /* 印章感 */
  background: var(--vermilion);
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
}
.brand-text {
  font-family: var(--font-display);
  font-size: 1.1rem;
  letter-spacing: 0.15rem;
}
.nav {
  display: flex;
  gap: 0.25rem;
}
.nav-link {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  color: var(--paper-aged);
  text-decoration: none;
  border-radius: 2px;
  font-size: 0.9rem;
  transition: all 0.2s;
  letter-spacing: 0.05rem;
}
.nav-link:hover {
  color: var(--paper-white);
  background: rgba(255, 255, 255, 0.1);
}
.nav-link.active {
  color: var(--paper-white);
  background: rgba(194, 59, 34, 0.8);
}
.nav-icon {
  font-size: 1rem;
}

/* ===== Main · 宣纸区 ===== */
.main {
  flex: 1;
  padding: 2rem 0;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* ===== Footer · 落款 ===== */
.footer {
  border-top: 1px solid var(--paper-aged);
  padding: 1.5rem 0;
  text-align: center;
  color: var(--ink-faint);
  font-size: 0.8rem;
}
.footer-inner {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}
.footer-seal {
  color: var(--vermilion);
  font-weight: 600;
}
.footer-divider {
  color: var(--pine-ash);
}
</style>
