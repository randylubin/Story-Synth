import { useHead } from '@vueuse/head';

function normalizeEntries(entries) {
  if (!Array.isArray(entries)) return entries;
  return entries.map((entry) => {
    if (!entry || typeof entry !== 'object') return entry;
    const { vmid, ...rest } = entry;
    return vmid && !rest.key ? { ...rest, key: vmid } : rest;
  });
}

export const metaInfoMixin = {
  created() {
    const metaInfo = this.$options?.metaInfo;
    if (!metaInfo) return;

    const info = typeof metaInfo === 'function' ? metaInfo.call(this) : metaInfo;
    if (!info) return;

    const headObj = {
      title: info.title,
      titleTemplate: info.titleTemplate,
      meta: normalizeEntries(info.meta),
      link: normalizeEntries(info.link),
      htmlAttrs: info.htmlAttrs,
      bodyAttrs: info.bodyAttrs,
    };

    // store entry so we can dispose on unmount
    this.$_metaInfoEntry = useHead(headObj);
  },
  unmounted() {
    if (this.$_metaInfoEntry && typeof this.$_metaInfoEntry.dispose === 'function') {
      this.$_metaInfoEntry.dispose();
    }
  },
};
