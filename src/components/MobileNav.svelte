<script lang="ts">
  let isOpen = false;

  function toggle() {
    isOpen = !isOpen;
  }
</script>

<button on:click={toggle} class="p-1 lg:hidden focus:ring focus:outline-none group">
  <slot />
</button>

{#if isOpen}
  <div>hello</div>
{/if}
