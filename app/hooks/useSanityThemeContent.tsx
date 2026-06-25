import {useRootLoaderData} from '~/root';

export function useSanityThemeContent() {
  const rootData = useRootLoaderData();
  const data = rootData?.sanityRoot?.data;
  const themeContent = data?.themeContent;
  return {themeContent};
}
