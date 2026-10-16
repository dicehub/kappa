<script setup lang="ts">
import { Button, Field, LinkButton, LoginLayout } from "@dicehub/kappa";
</script>

<template>
  <header class="app-header">Application header</header>
  <main class="account-container">
    <LoginLayout
      label="Account"
      variant="split"
      style="--kappa-login-layout-min-block-size: 20rem"
    >
      <LinkButton class="sign-in" href="#sign-in">Sign in</LinkButton>
      <form @submit.prevent>
        <Field.Root required>
          <Field.Label>Email address</Field.Label>
          <Field.Input type="email" autocomplete="email" required />
        </Field.Root>
        <Button type="submit">Sign up</Button>
      </form>
      <template #media>Account illustration</template>
    </LoginLayout>
  </main>
</template>

<style scoped>
.app-header { block-size: 10rem; }
.account-container { inline-size: min(50rem, 100%); margin-inline: auto; }
.sign-in { position: absolute; inset-block-start: 1.75rem; inset-inline-end: 1rem; }
</style>
