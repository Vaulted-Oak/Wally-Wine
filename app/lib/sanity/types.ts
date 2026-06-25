import type {StudioPathLike} from '@sanity/client/csm';

/**
 * Callback function to encode data attributes for visual editing
 * This type is defined here to avoid importing from @sanity/react-loader
 * which can cause circular dependency issues in the worker environment
 */
export type EncodeDataAttributeCallback = (
  path: StudioPathLike,
) => string | undefined;

