<script setup lang="ts">
// Inherit the garden layout's sidebar logic if possible, or replicate a minimal version.
// For now, we'll wrap the Garden layout but override the main content area style
// to be full height and no padding if needed, or just use a clean slate.
// Actually, looking at app.vue, it uses NuxtLayout.
// Let's make this a standalone layout that might reuse components if they existed,
// but for now we'll keep it simple and focused on the chat experience.
</script>

<template>
  <div class="flex h-screen bg-body overflow-hidden">
    <!-- Sidebar Placeholder (or import the actual sidebar if it was a component) -->
    <!-- Assuming we want to keep the navigation. For now, let's just render the page content
         and let the page handle the "full screen" feel within the garden layout if we can,
         OR we define a layout that is just for chat.
         
         Given the user wants an "entire ai chatbot", a dedicated full-screen layout is best.
    -->
    
    <div class="flex-1 flex flex-col h-full relative">
      <slot />
    </div>
  </div>
</template>
