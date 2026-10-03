import { defineComponent, type PropType, type VNodeChild } from "vue";

/** Preserve Vue content without parsing HTML or stringifying VNodes. */
export default defineComponent({
  name: "ToastContent",
  props: { value: { type: null as unknown as PropType<VNodeChild> } },
  setup: (props) => () => props.value,
});
