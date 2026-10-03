<script setup lang="ts">
import { computed, ref } from "vue";
import { Button, Checkbox, Field, Link } from "@dicehub/kappa";

const props = withDefaults(
  defineProps<{
    emailOnly?: boolean;
  }>(),
  {
    emailOnly: false,
  },
);

const fullName = ref("");
const email = ref("");
const username = ref("");
const password = ref("");
const passwordVisible = ref(false);
const agreed = ref(false);
const status = ref("");

const namespace = computed(() => {
  const slug = username.value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "your-username";
});

const passwordScore = computed(() => {
  const value = password.value;
  if (!value) return 0;
  if (value.length < 8) return 1;

  const variety = [
    /[a-z]/.test(value) && /[A-Z]/.test(value),
    /\d/.test(value),
    /[^\w\s]/.test(value),
  ].filter(Boolean).length;

  if (value.length >= 12 && variety === 3) return 4;
  if (variety >= 2) return 3;
  return 2;
});

const passwordMessage = computed(() => {
  if (!password.value) return "Use at least 8 characters.";
  const messages = ["Very weak", "Very weak", "Fair", "Good", "Strong"] as const;
  return messages[passwordScore.value] ?? "Very weak";
});

const submit = () => {
  status.value = props.emailOnly
    ? `A demo account link was prepared for ${email.value}.`
    : `Demo signup submitted for ${fullName.value || username.value || email.value}.`;
};

const announce = (message: string) => {
  status.value = message;
};
</script>

<template>
  <form
    class="signup-form-demo"
    :data-email-only="props.emailOnly ? '' : undefined"
    data-signup-form
    @submit.prevent="submit"
  >
    <div class="signup-form-demo__fields">
      <Field.Root v-if="!props.emailOnly" required>
        <Field.Label>Full name</Field.Label>
        <Field.Input
          v-model="fullName"
          name="name"
          autocomplete="name"
          placeholder="Joe Smith"
          required
        />
        <Field.HelperText>
          Your name helps collaborators know who they are working with.
        </Field.HelperText>
      </Field.Root>

      <Field.Root required>
        <Field.Label>Email address</Field.Label>
        <Field.Input
          v-model="email"
          name="email"
          type="email"
          autocomplete="email"
          placeholder="email@example.com"
          required
        />
        <Field.HelperText v-if="!props.emailOnly">
          Used for authentication and account notifications.
        </Field.HelperText>
      </Field.Root>

      <Field.Root v-if="!props.emailOnly" required>
        <Field.Label>Username</Field.Label>
        <Field.Input
          v-model="username"
          name="username"
          autocomplete="username"
          placeholder="joe"
          required
        />
        <Field.HelperText>
          Your personal project namespace:
          <Link
            :href="`#${namespace}`"
            @click.prevent="announce(`Namespace preview opened for ${namespace}.`)"
          >
            dicehub.com/{{ namespace }}/my-project
          </Link>
        </Field.HelperText>
      </Field.Root>

      <Field.Root v-if="!props.emailOnly" required>
        <Field.Label>Password</Field.Label>
        <div class="signup-form-demo__password-control">
          <Field.Input
            v-model="password"
            name="password"
            :type="passwordVisible ? 'text' : 'password'"
            autocomplete="new-password"
            minlength="8"
            required
          />
          <button
            class="signup-form-demo__password-toggle"
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
        <div class="signup-form-demo__password-feedback" :data-score="passwordScore">
          <div class="signup-form-demo__password-strength" aria-hidden="true">
            <i v-for="index in 4" :key="index" :data-active="index <= passwordScore ? '' : undefined" />
          </div>
          <Field.HelperText class="signup-form-demo__password-message" aria-live="polite">
            {{ passwordMessage }}
          </Field.HelperText>
        </div>
      </Field.Root>
    </div>

    <Checkbox.Root
      v-if="!props.emailOnly"
      v-model:checked="agreed"
      class="signup-form-demo__terms"
      name="terms"
      required
    >
      <Checkbox.Control />
      <Checkbox.Label>
        By signing up, I agree to dicehub's
        <Link href="#terms" @click.stop>terms</Link>,
        <Link href="#privacy" @click.stop>privacy policy</Link>, and
        <Link href="#cookies" @click.stop>cookie policy</Link>.
      </Checkbox.Label>
    </Checkbox.Root>

    <Button type="submit" variant="primary" size="lg" full-width>
      {{ props.emailOnly ? "Create account" : "Sign up" }}
    </Button>

    <div class="signup-form-demo__providers">
      <div class="signup-form-demo__divider" aria-hidden="true">
        <span>Or continue with</span>
      </div>

      <div class="signup-form-demo__provider-buttons">
        <Button
          class="signup-form-demo__provider-button"
          type="button"
          variant="outline"
          size="lg"
          full-width
          @click="announce('Google sign-in selected.')"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path fill="#4285f4" d="M21.6 12.2c0-.7-.1-1.4-.2-2.1H12v4h5.4a4.6 4.6 0 0 1-2 3v2.6h3.2c1.9-1.7 3-4.3 3-7.5Z" />
            <path fill="#34a853" d="M12 22c2.7 0 5-.9 6.6-2.3l-3.2-2.6c-.9.6-2 1-3.4 1a5.8 5.8 0 0 1-5.5-4H3.2v2.7A10 10 0 0 0 12 22Z" />
            <path fill="#fbbc05" d="M6.5 14.1a6 6 0 0 1 0-4.2V7.2H3.2A10 10 0 0 0 2 12c0 1.7.4 3.3 1.2 4.8l3.3-2.7Z" />
            <path fill="#ea4335" d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.8A9.7 9.7 0 0 0 12 2a10 10 0 0 0-8.8 5.2l3.3 2.7a5.8 5.8 0 0 1 5.5-4Z" />
          </svg>
          Sign in with Google
        </Button>

        <Button
          class="signup-form-demo__provider-button"
          type="button"
          variant="outline"
          size="lg"
          full-width
          @click="announce('GitHub sign-in selected.')"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              fill="currentColor"
              d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.82a9.6 9.6 0 0 1 2.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
            />
          </svg>
          Sign in with GitHub
        </Button>
      </div>
    </div>

    <p class="signup-form-demo__sign-in">
      Already have an account?
      <Link href="#sign-in" @click.prevent="announce('Sign in opened.')">Sign in</Link>
    </p>

    <p v-if="status" class="signup-form-demo__status" aria-live="polite">{{ status }}</p>
  </form>
</template>
