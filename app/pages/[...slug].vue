<script setup lang="ts">
import { kebabCase } from "scule";
import type {
  ContentNavigationItem,
  Collections,
  DocsCollectionItem,
} from "@nuxt/content";
import { findPageHeadline } from "@nuxt/content/utils";
// import { addPrerenderPath } from '../../utils/prerender'

definePageMeta({
  layout: "docs",
});

const route = useRoute();
const { locale, isEnabled, t } = useDocusI18n();
const appConfig = useAppConfig();
const navigation = inject<Ref<ContentNavigationItem[]>>("navigation");

const collectionName = computed(() =>
  isEnabled.value ? `docs_${locale.value}` : "docs"
);

const [{ data: page }, { data: surround }] = await Promise.all([
  useAsyncData(
    kebabCase(route.path),
    () =>
      queryCollection(collectionName.value as keyof Collections)
        .path(route.path)
        .first() as Promise<DocsCollectionItem>
  ),
  useAsyncData(`${kebabCase(route.path)}-surround`, () => {
    return queryCollectionItemSurroundings(
      collectionName.value as keyof Collections,
      route.path,
      {
        fields: ["description"],
      }
    );
  }),
]);

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}

if (page.value.layout) {
  setPageLayout(page.value.layout as never);
}

addPrerenderPath(`/raw${route.path}.md`);

const title = page.value.seo?.title || page.value.title;
const description = page.value.seo?.description || page.value.description;

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
});

const headline = ref(findPageHeadline(navigation?.value, page.value?.path));
watch(
  () => navigation?.value,
  () => {
    headline.value =
      findPageHeadline(navigation?.value, page.value?.path) || headline.value;
  }
);

defineOgImageComponent("Docs", {
  headline: headline.value,
});

const headerDescription = computed(() => {
  const summary = page.value?.description || "";
  if (!summary) {
    return undefined;
  }
  return summary.replace(/\r/g, "").split("\n").at(0) || undefined;
});
</script>

<template>
  <UContainer v-if="page">
    <UContainer
      :title="page.title"
      :description="headerDescription"
      :headline="headline"
      :ui="{
        wrapper: 'flex-row items-center flex-wrap justify-between',
      }"
    >
      <template v-if="(page as DocsCollectionItem).links?.length" #links>
        <UButton
          v-for="(link, index) in (page as DocsCollectionItem).links"
          :key="index"
          size="sm"
          v-bind="link"
        />
      </template>
    </UContainer>

    <UContainer>
      <ContentRenderer v-if="page" :value="page" />

      <!-- <UContentSurround :surround="surround" /> -->
    </UContainer>
  </UContainer>
</template>
