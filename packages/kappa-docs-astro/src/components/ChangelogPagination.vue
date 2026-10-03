<script setup lang="ts">
import { Pagination } from "@dicehub/kappa/components/pagination";

const props = defineProps<{
  page: number;
  perPage: number;
  totalCount: number;
}>();

const getPageUrl = ({ page }: { page: number }) =>
  page <= 1 ? "/docs/changelog/" : `/docs/changelog/${page}/`;
</script>

<template>
  <Pagination.Root
    class="changelog-pages"
    :count="props.totalCount"
    :default-page="props.page"
    :page-size="props.perPage"
    :get-page-url="getPageUrl"
    type="link"
    aria-label="Changelog pages"
  >
    <ul class="changelog-pages__list">
      <li>
        <Pagination.PrevTrigger as-child>
          <a aria-label="Previous changelog page" />
        </Pagination.PrevTrigger>
      </li>
      <Pagination.Context v-slot="pagination">
        <template
          v-for="(item, index) in pagination.pages"
          :key="item.type === 'page' ? item.value : `ellipsis-${index}`"
        >
          <li v-if="item.type === 'page'">
            <Pagination.Item type="page" :value="item.value" as-child>
              <a>{{ item.value }}</a>
            </Pagination.Item>
          </li>
          <li v-else>
            <Pagination.Ellipsis :index="index" />
          </li>
        </template>
      </Pagination.Context>
      <li>
        <Pagination.NextTrigger as-child>
          <a aria-label="Next changelog page" />
        </Pagination.NextTrigger>
      </li>
    </ul>
  </Pagination.Root>
</template>
