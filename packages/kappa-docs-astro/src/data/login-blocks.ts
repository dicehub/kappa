// read_when: Add or change Login block layouts, preview routes, or source examples.
export const loginBlocks = [
  {
    id: "simple",
    title: "Simple",
    description: "A focused credential form centered on a quiet page.",
    layoutVariant: "centered",
  },
  {
    id: "split",
    title: "Split Media",
    description: "A full-height form beside product or organization context.",
    layoutVariant: "split",
  },
  {
    id: "panel",
    title: "Muted Panel",
    description: "A contained login panel on a muted application surface.",
    layoutVariant: "panel",
  },
  {
    id: "media-card",
    title: "Media Card",
    description: "A compact two-column card with supporting media on the logical start side.",
    layoutVariant: "card",
  },
  {
    id: "email-only",
    title: "Email Only",
    description: "A minimal passwordless entry point for email-link authentication.",
    layoutVariant: "centered",
  },
  {
    id: "neutral-background",
    title: "Neutral Background",
    description: "A compact credential form on a quiet neutral application surface.",
    layoutVariant: "centered",
  },
] as const;

export type LoginBlockId = (typeof loginBlocks)[number]["id"];

const loginFormSource = (emailOnly: boolean) => `<form @submit.prevent="submit">
      <Field.Root required>
        <Field.Label>${emailOnly ? "Email" : "Email or username"}</Field.Label>
        <Field.Input
          v-model="email"
          type="${emailOnly ? "email" : "text"}"
          autocomplete="${emailOnly ? "email" : "username"}"
          required
        />
      </Field.Root>${emailOnly ? "" : `

      <Field.Root required>
        <Field.Label>Password</Field.Label>
        <div class="password-control">
          <Field.Input
            v-model="password"
            :type="passwordVisible ? 'text' : 'password'"
            autocomplete="current-password"
            required
          />
          <button
            type="button"
            :aria-label="passwordVisible ? 'Hide password' : 'Show password'"
            :aria-pressed="passwordVisible"
            @click="passwordVisible = !passwordVisible"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <template v-if="passwordVisible">
                <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
                <path d="m2 2 20 20" />
              </template>
              <template v-else>
                <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                <circle cx="12" cy="12" r="3" />
              </template>
            </svg>
          </button>
        </div>
      </Field.Root>

      <Checkbox.Root name="remember">
        <Checkbox.Control />
        <Checkbox.Label>Keep me signed in</Checkbox.Label>
      </Checkbox.Root>`}

      <Button type="submit" variant="primary" full-width>
        ${emailOnly ? "Send sign-in link" : "Sign in"}
      </Button>

      <div class="social-providers">
        <div class="social-divider" aria-hidden="true">
          <span>Or continue with</span>
        </div>

        <div class="social-buttons">
          <Button type="button" variant="outline" full-width>
            Continue with Google
          </Button>
          <Button type="button" variant="outline" full-width>
            Continue with GitHub
          </Button>
        </div>
      </div>

      <p>
        New to dicehub? <Link href="/sign-up">Create an account</Link>
      </p>${emailOnly ? "" : `
      <p>
        Forgot your <Link href="/forgot-password">password</Link>?
      </p>`}
    </form>`;

export const loginBlockSource = (id: LoginBlockId): string => {
  const block = loginBlocks.find(item => item.id === id) ?? loginBlocks[0];
  const hasMedia = id === "split" || id === "media-card";
  const mediaSide = id === "media-card" ? ' media-side="start"' : "";
  const imports = `Button, Checkbox, Field, Link${id === "split" ? ", LinkButton" : ""}, LoginLayout`;
  const exampleStyles = id === "split"
    ? `

<style scoped>
.login-page { position: relative; }
.sign-up {
  position: absolute;
  z-index: 1;
  top: 1.75rem;
  right: 1rem;
}
</style>`
    : id === "neutral-background"
      ? `

<style scoped>
.login-page {
  --kappa-login-layout-max-inline-size: 17.5rem;
  background: #f4f4f4;
}

.login-page :deep([data-slot="login-layout-brand"]) {
  inline-size: min(35.625rem, calc(100vw - 2rem));
  justify-self: center;
  padding-block-end: 1.5625rem;
  border-block-end: 1px solid #ebebeb;
}
.social-divider {
  margin-block: 2.1875rem 1.5625rem;
  overflow: hidden;
  color: var(--kappa-subtle);
  text-align: center;
}
.social-divider span { position: relative; display: inline-block; }
.social-divider span::before,
.social-divider span::after {
  position: absolute;
  top: 50%;
  width: 12.5rem;
  height: 1px;
  background: var(--kappa-line);
  content: "";
}
.social-divider span::before { left: calc(100% + 0.625rem); }
.social-divider span::after { right: calc(100% + 0.625rem); }
.social-buttons { display: grid; gap: 1rem; }
</style>`
      : "";

  return `<script setup lang="ts">
import { ref } from "vue";
import { ${imports} } from "@dicehub/kappa";

const email = ref("");
const password = ref("");
const passwordVisible = ref(false);
const submit = () => { /* Connect your authentication service. */ };
</script>

<template>
  <LoginLayout class="login-page" variant="${block.layoutVariant}"${mediaSide} label="Sign in">
    <template #brand>Your product</template>${id === "split" ? `

    <LinkButton class="sign-up" href="/sign-up" size="lg">
      Sign up
    </LinkButton>` : ""}

    ${loginFormSource(id === "email-only")}${hasMedia ? `

    <template #media>
      ${id === "split" ? `<img src="/login-engine.svg" alt="" />` : `<img src="/login-mesh.svg" alt="" />`}
    </template>` : ""}

    <template #footer>
      By continuing, I agree to dicehub's
      <a href="/terms">terms</a>, <a href="/privacy">privacy policy</a>, and
      <a href="/cookies">cookie policy</a>.
    </template>
  </LoginLayout>
</template>${exampleStyles}`;
};
