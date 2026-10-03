// read_when: Add or change Signup block layouts, preview routes, or source examples.
export const signupBlocks = [
  {
    id: "complete",
    title: "Complete Account",
    description: "The full dicehub account form with identity, namespace, password, and consent.",
    layoutVariant: "centered",
  },
  {
    id: "split",
    title: "Split Media",
    description: "The complete form beside a technical product visual and a direct sign-in action.",
    layoutVariant: "split",
  },
  {
    id: "panel",
    title: "Muted Panel",
    description: "A contained signup panel on a quiet application background.",
    layoutVariant: "panel",
  },
  {
    id: "media-card",
    title: "Media Card",
    description: "A compact two-column signup card with contextual workspace media.",
    layoutVariant: "card",
  },
  {
    id: "email-only",
    title: "Email Only",
    description: "A minimal account entry point for applications that complete registration later.",
    layoutVariant: "centered",
  },
] as const;

export type SignupBlockId = (typeof signupBlocks)[number]["id"];

const identityFields = `<Field.Root required>
        <Field.Label>Full name</Field.Label>
        <Field.Input v-model="fullName" autocomplete="name" required />
        <Field.HelperText>Your name identifies you to collaborators.</Field.HelperText>
      </Field.Root>

      <Field.Root required>
        <Field.Label>Email address</Field.Label>
        <Field.Input v-model="email" type="email" autocomplete="email" required />
        <Field.HelperText>Used for authentication and account notifications.</Field.HelperText>
      </Field.Root>

      <Field.Root required>
        <Field.Label>Username</Field.Label>
        <Field.Input v-model="username" autocomplete="username" required />
        <Field.HelperText>Your username becomes your personal project namespace.</Field.HelperText>
      </Field.Root>

      <Field.Root required>
        <Field.Label>Password</Field.Label>
        <div class="password-control">
          <Field.Input
            v-model="password"
            :type="passwordVisible ? 'text' : 'password'"
            autocomplete="new-password"
            minlength="8"
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

      <Checkbox.Root v-model:checked="agreed" name="terms" required>
        <Checkbox.Control />
        <Checkbox.Label>
          By signing up, I agree to the terms, privacy policy, and cookie policy.
        </Checkbox.Label>
      </Checkbox.Root>`;

const signupFormSource = (emailOnly: boolean) => `<form @submit.prevent="submit">
      ${emailOnly ? `<Field.Root required>
        <Field.Label>Email address</Field.Label>
        <Field.Input v-model="email" type="email" autocomplete="email" required />
      </Field.Root>` : identityFields}

      <Button type="submit" variant="primary" full-width>
        ${emailOnly ? "Create account" : "Sign up"}
      </Button>

      <div class="social-providers">
        <div class="social-divider" aria-hidden="true">
          <span>Or continue with</span>
        </div>
        <div class="social-buttons">
          <Button type="button" variant="outline" full-width>Sign in with Google</Button>
          <Button type="button" variant="outline" full-width>Sign in with GitHub</Button>
        </div>
      </div>

      <p>Already have an account? <Link href="/sign-in">Sign in</Link></p>
    </form>`;

export const signupBlockSource = (id: SignupBlockId): string => {
  const block = signupBlocks.find(item => item.id === id) ?? signupBlocks[0];
  const hasMedia = id === "split" || id === "media-card";
  const mediaSide = id === "media-card" ? ' media-side="start"' : "";
  const imports = `Button, Checkbox, Field, Link${id === "split" ? ", LinkButton" : ""}, LoginLayout`;
  const completeStyles = id === "complete"
    ? `
.signup-page {
  --kappa-login-layout-max-inline-size: 35.625rem;
  background: #f4f4f4;
}
.signup-page form {
  max-inline-size: 25rem;
  margin-inline: auto;
}
.signup-page h1 { color: var(--kappa-dicehub-logo-ink, #333333); }`
    : "";

  return `<script setup lang="ts">
import { ref } from "vue";
import { ${imports} } from "@dicehub/kappa";

const fullName = ref("");
const email = ref("");
const username = ref("");
const password = ref("");
const passwordVisible = ref(false);
const agreed = ref(false);
const submit = () => { /* Connect your account service. */ };
</script>

<template>
  <LoginLayout class="signup-page" variant="${block.layoutVariant}"${mediaSide} label="Sign up">
    <template #brand>Your product</template>${id === "split" ? `

    <LinkButton class="sign-in" href="/sign-in">Sign in</LinkButton>` : ""}

    <h1>${id === "email-only" ? "Create your account" : "Great! You decided to sign up."}</h1>

    ${signupFormSource(id === "email-only")}${hasMedia ? `

    <template #media>
      <img src="/${id === "split" ? "engine-cycle" : "workspace-preview"}.svg" alt="" />
    </template>` : ""}

    ${id === "email-only" ? `<template #footer>
      By continuing, I agree to the terms, privacy policy, and cookie policy.
    </template>` : ""}
  </LoginLayout>
</template>

<style scoped>
.signup-page { min-block-size: 100svh; }${completeStyles}
.signup-page h1 { margin: 0 0 0.875rem; text-align: center; }
.social-providers { max-inline-size: 17.5rem; margin: 2.1875rem auto 0; }
.social-divider {
  margin-block-end: 1.5625rem;
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
.password-control { position: relative; }
.sign-in { position: absolute; z-index: 1; inset-block-start: 1.75rem; inset-inline-end: 1rem; }
</style>`;
};
