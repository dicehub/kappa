<script setup lang="ts">
import { ref } from "vue";
import { ChevronDown } from "@lucide/vue";
import { ActivityFeed } from "@dicehub/kappa/components/activity-feed";
import { Avatar } from "@dicehub/kappa/components/avatar";
import { Collapsible } from "@dicehub/kappa/components/collapsible";

const open = ref(false);
</script>

<template>
  <ActivityFeed.Root>
    <ActivityFeed.List aria-label="Detailed project activity">
      <ActivityFeed.Item>
        <ActivityFeed.Marker variant="avatar">
          <Avatar.Root>
            <Avatar.Image src="/avatars/mei-chen.webp" alt="" />
            <Avatar.Fallback aria-hidden="true">MC</Avatar.Fallback>
          </Avatar.Root>
        </ActivityFeed.Marker>
        <ActivityFeed.Content>
          <Collapsible.Root v-model:open="open" class="activity-feed-expandable">
            <ActivityFeed.Header>
              <ActivityFeed.Title>Mei Chen</ActivityFeed.Title>
              <ActivityFeed.Time datetime="2026-09-19T12:06:00Z">12:06</ActivityFeed.Time>
            </ActivityFeed.Header>
            <ActivityFeed.Description>
              Published a detailed review of run 184. Three changes are required before the next
              wind tunnel comparison.
            </ActivityFeed.Description>
            <Collapsible.Content class="activity-feed-expandable__content">
              <div class="activity-feed-expandable__report">
                <p>
                  I compared the production mesh with the reference case at 14.2 m/s. The mean
                  drag coefficient is within the target range, but the pressure distribution
                  around the rear wheel still changes between the final sampling windows. Keep
                  this run as a baseline while we check the remaining differences.
                </p>
                <h4>Boundary conditions</h4>
                <p>
                  Change the inlet turbulence intensity from 1% to 0.5% to match the measured
                  tunnel conditions. Keep the velocity profile and air temperature unchanged.
                  The outlet pressure and symmetry boundaries already match the reference
                  setup, so they do not need an update.
                </p>
                <h4>Mesh and convergence</h4>
                <p>
                  Add one refinement level around the rear wheel and the wake. The current mesh
                  passes all 18 geometry checks, but the local cell size is too large to resolve
                  the pressure gradient. Preserve the existing prism layers and check the wall
                  distance again after the new volume mesh is generated.
                </p>
                <p>
                  Extend the solver by 500 iterations after the residuals settle. Compare the
                  final three force averages instead of the last sample alone. Record the
                  maximum Courant number and the mass imbalance with the exported results so
                  the next review can use the same acceptance checks.
                </p>
                <h4>Next steps</h4>
                <p>
                  Save the updated configuration as a new revision, attach the mesh quality
                  report, and run the comparison on the same 32-core allocation. Share the
                  pressure and force plots with Lina before marking the case ready for release.
                  The original run remains available for comparison.
                </p>
              </div>
            </Collapsible.Content>
            <div class="activity-feed-expandable__footer">
              <Collapsible.Trigger
                class="activity-feed-expandable__trigger"
                :aria-label="open ? 'Collapse review details' : 'Expand review details'"
              >
                <template #indicator>
                  <ChevronDown class="activity-feed-expandable__arrow" aria-hidden="true" />
                </template>
              </Collapsible.Trigger>
            </div>
          </Collapsible.Root>
        </ActivityFeed.Content>
      </ActivityFeed.Item>
    </ActivityFeed.List>
  </ActivityFeed.Root>
</template>

<style scoped>
.activity-feed-expandable {
  border: 0;
  border-radius: 0;
  background: transparent;
}

.activity-feed-expandable__footer {
  display: flex;
  justify-content: center;
  margin-block-start: 0.5rem;
  margin-block-end: calc(
    0.25rem - var(--kappa-activity-feed-item-padding-block)
  );
  /* Include the marker column so the arrow is centered on the whole card. */
  margin-inline-start: calc(
    0px - var(--kappa-activity-feed-marker-size) - var(--kappa-activity-feed-item-gap)
  );
}

.activity-feed-expandable__trigger {
  inline-size: 1.75rem;
  min-block-size: 1.75rem;
  justify-content: center;
  padding: 0;
  border-radius: 0.25rem;
  color: var(--kappa-subtle);
}

.activity-feed-expandable__trigger[data-state="open"] {
  background: transparent;
}

.activity-feed-expandable__arrow {
  inline-size: 1rem;
  block-size: 1rem;
  transition: transform 160ms ease;
}

.activity-feed-expandable__trigger[data-state="open"] .activity-feed-expandable__arrow {
  transform: rotate(180deg);
}

.activity-feed-expandable__content {
  border: 0;
}

.activity-feed-expandable__content :deep([data-slot="collapsible-content-body"]) {
  padding: 0.875rem 0 0;
}

.activity-feed-expandable__report {
  border-block-start: 1px solid var(--kappa-line);
  padding-block-start: 0.875rem;
  color: var(--kappa-subtle);
  font-size: 0.8125rem;
  line-height: 1.6;
  overflow-wrap: anywhere;
}

.activity-feed-expandable__report p {
  margin: 0;
}

.activity-feed-expandable__report h4 {
  margin: 1rem 0 0.25rem;
  color: var(--kappa-default);
  font-size: inherit;
  font-weight: 600;
}

.activity-feed-expandable__report p + p {
  margin-block-start: 0.75rem;
}

@media (prefers-reduced-motion: reduce) {
  .activity-feed-expandable__arrow {
    transition: none;
  }
}
</style>
