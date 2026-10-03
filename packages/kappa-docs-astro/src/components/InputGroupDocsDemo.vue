<script setup lang="ts">
import {
  AtSign,
  Check,
  Copy,
  Eye,
  EyeOff,
  FileCode2,
  Link2,
  Search,
  SendHorizontal,
} from "@lucide/vue";
import { ref } from "vue";
import { InputGroup } from "@dicehub/kappa/components/input-group";

type DemoVariant =
  | "preview"
  | "usage"
  | "alignment"
  | "text"
  | "button"
  | "textarea"
  | "states"
  | "sizes"
  | "rtl";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const repository = ref("");
const query = ref("");
const token = ref("kappa-demo-token");
const message = ref("");
const showToken = ref(false);
const copied = ref(false);
const submitted = ref(false);

const copyToken = () => {
  copied.value = true;
  window.setTimeout(() => {
    copied.value = false;
  }, 1600);
};

const submitMessage = () => {
  submitted.value = true;
};
</script>

<template>
  <div class="input-group-demo" :data-input-group-demo="props.variant">
    <div v-if="props.variant === 'preview'" class="input-group-demo__preview">
      <div class="input-group-demo__eyebrow">
        <span class="input-group-demo__signal" aria-hidden="true" />
        Endpoint
      </div>
      <InputGroup aria-label="Repository endpoint">
        <InputGroup.Input
          v-model="repository"
          aria-label="Repository endpoint"
          placeholder="repository.example"
          type="url"
        />
        <InputGroup.Addon align="inline-start">
          <InputGroup.Text><Link2 aria-hidden="true" /> https://</InputGroup.Text>
        </InputGroup.Addon>
        <InputGroup.Addon align="inline-end">
          <InputGroup.Button
            aria-label="Inspect repository endpoint"
            shape="square"
            @click="repository = repository.trim()"
          >
            <Search aria-hidden="true" />
          </InputGroup.Button>
        </InputGroup.Addon>
      </InputGroup>
      <output class="input-group-demo__output" aria-live="polite">
        {{ repository ? `Ready to inspect ${repository}` : "Enter an endpoint to continue" }}
      </output>
    </div>

    <InputGroup v-else-if="props.variant === 'usage'" aria-label="Search runs">
      <InputGroup.Input
        v-model="query"
        aria-label="Search runs"
        placeholder="Search runs, cases, or solvers"
      />
      <InputGroup.Addon align="inline-start">
        <Search aria-hidden="true" />
      </InputGroup.Addon>
    </InputGroup>

    <div v-else-if="props.variant === 'alignment'" class="input-group-demo__alignment">
      <div>
        <span class="input-group-demo__caption">Inline start</span>
        <InputGroup aria-label="Inline start example">
          <InputGroup.Input aria-label="Inline start value" placeholder="Search" />
          <InputGroup.Addon align="inline-start"><Search aria-hidden="true" /></InputGroup.Addon>
        </InputGroup>
      </div>
      <div>
        <span class="input-group-demo__caption">Inline end</span>
        <InputGroup aria-label="Inline end example">
          <InputGroup.Input aria-label="Inline end value" placeholder="Search" />
          <InputGroup.Addon align="inline-end"><AtSign aria-hidden="true" /></InputGroup.Addon>
        </InputGroup>
      </div>
      <div>
        <span class="input-group-demo__caption">Block start</span>
        <InputGroup aria-label="Block start example">
          <InputGroup.Input aria-label="Block start value" placeholder="Value" />
          <InputGroup.Addon align="block-start"><FileCode2 aria-hidden="true" /> Request path</InputGroup.Addon>
        </InputGroup>
      </div>
      <div>
        <span class="input-group-demo__caption">Block end</span>
        <InputGroup aria-label="Block end example">
          <InputGroup.Input aria-label="Block end value" placeholder="Value" />
          <InputGroup.Addon align="block-end"><InputGroup.Text>Optional</InputGroup.Text></InputGroup.Addon>
        </InputGroup>
      </div>
    </div>

    <div v-else-if="props.variant === 'text'" class="input-group-demo__text-examples">
      <InputGroup aria-label="Amount">
        <InputGroup.Input aria-label="Amount" placeholder="0.00" inputmode="decimal" />
        <InputGroup.Addon align="inline-start"><InputGroup.Text>$</InputGroup.Text></InputGroup.Addon>
        <InputGroup.Addon align="inline-end"><InputGroup.Text>USD</InputGroup.Text></InputGroup.Addon>
      </InputGroup>
      <InputGroup aria-label="Website">
        <InputGroup.Input aria-label="Website" placeholder="example" />
        <InputGroup.Addon align="inline-start"><InputGroup.Text>https://</InputGroup.Text></InputGroup.Addon>
        <InputGroup.Addon align="inline-end"><InputGroup.Text>.com</InputGroup.Text></InputGroup.Addon>
      </InputGroup>
      <InputGroup aria-label="Username">
        <InputGroup.Input aria-label="Username" placeholder="username" />
        <InputGroup.Addon align="inline-start"><AtSign aria-hidden="true" /></InputGroup.Addon>
        <InputGroup.Addon align="inline-end"><InputGroup.Text>dicehub</InputGroup.Text></InputGroup.Addon>
      </InputGroup>
    </div>

    <div v-else-if="props.variant === 'button'" class="input-group-demo__button-examples">
      <InputGroup aria-label="Access token">
        <InputGroup.Input
          :model-value="showToken ? token : '••••••••••••••••'"
          aria-label="Access token"
          readonly
        />
        <InputGroup.Addon align="inline-end">
          <InputGroup.Button
            aria-label="Toggle access token visibility"
            shape="square"
            @click="showToken = !showToken"
          >
            <EyeOff v-if="showToken" aria-hidden="true" />
            <Eye v-else aria-hidden="true" />
          </InputGroup.Button>
          <InputGroup.Button
            :aria-label="copied ? 'Access token copied' : 'Copy access token'"
            shape="square"
            @click="copyToken"
          >
            <Check v-if="copied" aria-hidden="true" />
            <Copy v-else aria-hidden="true" />
          </InputGroup.Button>
        </InputGroup.Addon>
      </InputGroup>
      <InputGroup aria-label="Run search">
        <InputGroup.Input aria-label="Run search" placeholder="Type to search runs" />
        <InputGroup.Addon align="inline-end">
          <InputGroup.Button aria-label="Search runs" shape="square">
            <Search aria-hidden="true" />
          </InputGroup.Button>
        </InputGroup.Addon>
      </InputGroup>
    </div>

    <div v-else-if="props.variant === 'textarea'" class="input-group-demo__textarea">
      <InputGroup aria-label="Release note">
        <InputGroup.Textarea
          v-model="message"
          aria-label="Release note"
          placeholder="Describe the solver change..."
          rows="3"
        />
        <InputGroup.Addon align="block-end">
          <InputGroup.Text>{{ message.length }}/280</InputGroup.Text>
          <InputGroup.Button
            :disabled="message.length === 0"
            aria-label="Post release note"
            shape="square"
            @click="submitMessage"
          >
            <SendHorizontal aria-hidden="true" />
          </InputGroup.Button>
        </InputGroup.Addon>
      </InputGroup>
      <output aria-live="polite">{{ submitted ? "Release note queued" : "" }}</output>
    </div>

    <div v-else-if="props.variant === 'states'" class="input-group-demo__states">
      <InputGroup invalid aria-label="Invalid run name">
        <InputGroup.Input aria-label="Invalid run name" value="bad/name" />
        <InputGroup.Addon align="inline-end"><InputGroup.Text>Required</InputGroup.Text></InputGroup.Addon>
      </InputGroup>
      <InputGroup disabled aria-label="Disabled run name">
        <InputGroup.Input aria-label="Disabled run name" value="archived-run" />
        <InputGroup.Addon align="inline-end"><InputGroup.Text>Archived</InputGroup.Text></InputGroup.Addon>
      </InputGroup>
      <InputGroup aria-label="Loading run search">
        <InputGroup.Input aria-label="Loading run search" placeholder="Searching..." />
        <InputGroup.Addon align="inline-end">
          <InputGroup.Button loading aria-label="Search in progress" shape="square" />
        </InputGroup.Addon>
      </InputGroup>
    </div>

    <div v-else-if="props.variant === 'sizes'" class="input-group-demo__sizes">
      <InputGroup v-for="size in ['xs', 'sm', 'base', 'lg']" :key="size" :size="size" :aria-label="`${size} size`">
        <InputGroup.Input :aria-label="`${size} size value`" :placeholder="size" />
        <InputGroup.Addon align="inline-end"><InputGroup.Text>{{ size }}</InputGroup.Text></InputGroup.Addon>
      </InputGroup>
    </div>

    <div v-else class="input-group-demo__rtl" dir="rtl" lang="ar">
      <InputGroup aria-label="بحث في التشغيلات">
        <InputGroup.Input aria-label="بحث في التشغيلات" placeholder="ابحث في التشغيلات..." />
        <InputGroup.Addon align="inline-start"><Search aria-hidden="true" /></InputGroup.Addon>
        <InputGroup.Addon align="inline-end"><InputGroup.Text>١٢ نتيجة</InputGroup.Text></InputGroup.Addon>
      </InputGroup>
      <p>المدخلات المركبة تحافظ على اتجاه النص والمسافات المنطقية.</p>
    </div>
  </div>
</template>

<style scoped>
.input-group-demo {
  display: grid;
  inline-size: 100%;
  min-inline-size: 0;
  min-block-size: 8rem;
  place-items: center;
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-sans, inherit);
}

.input-group-demo__preview,
.input-group-demo__textarea,
.input-group-demo__rtl {
  display: grid;
  inline-size: min(100%, 34rem);
  min-inline-size: 0;
  gap: 0.625rem;
}

.input-group-demo__preview {
  gap: 0.75rem;
}

.input-group-demo__eyebrow,
.input-group-demo__caption {
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.6875rem;
  font-weight: 650;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.input-group-demo__eyebrow {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.input-group-demo__signal {
  inline-size: 0.4rem;
  block-size: 0.4rem;
  border-radius: 999px;
  background: var(--kappa-success-solid, #027a48);
  box-shadow: 0 0 0 3px var(--kappa-success-soft, rgba(2, 122, 72, 0.14));
}

.input-group-demo__output,
.input-group-demo__textarea output {
  min-block-size: 1rem;
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.75rem;
}

.input-group-demo__alignment,
.input-group-demo__text-examples,
.input-group-demo__button-examples,
.input-group-demo__states,
.input-group-demo__sizes {
  display: grid;
  inline-size: min(100%, 32rem);
  min-inline-size: 0;
  gap: 0.75rem;
}

.input-group-demo__alignment > div {
  display: grid;
  gap: 0.35rem;
}

.input-group-demo__button-examples {
  gap: 1rem;
}

.input-group-demo__states {
  gap: 1rem;
}

.input-group-demo__rtl {
  max-inline-size: 34rem;
  text-align: start;
}

.input-group-demo__rtl p {
  margin: 0;
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.75rem;
}

@media (max-width: 30rem) {
  .input-group-demo__preview,
  .input-group-demo__textarea,
  .input-group-demo__rtl,
  .input-group-demo__alignment,
  .input-group-demo__text-examples,
  .input-group-demo__button-examples,
  .input-group-demo__states,
  .input-group-demo__sizes {
    inline-size: 100%;
  }
}
</style>
