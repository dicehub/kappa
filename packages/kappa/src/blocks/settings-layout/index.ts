import SettingsLayoutRoot from "./SettingsLayout.vue";
import SettingsSection from "./SettingsSection.vue";

export const SettingsLayout = Object.assign(SettingsLayoutRoot, { Section: SettingsSection });
export { SettingsSection };
export type {
  SettingsLayoutProps,
  SettingsLayoutSlots,
  SettingsSectionContext,
  SettingsSectionEmits,
  SettingsSectionProps,
  SettingsSectionSlots,
} from "./settings-layout";
