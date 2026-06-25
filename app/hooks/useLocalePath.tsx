import {useRootLoaderData} from '~/root';

export function useLocalePath(props: {path: string}) {
  const rootData = useRootLoaderData();
  const {path} = props;
  const pathPrefix = rootData?.locale?.pathPrefix;

  if (pathPrefix) {
    return `${pathPrefix}${path}`;
  }

  return path;
}
