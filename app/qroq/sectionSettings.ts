/**
 * Section settings fragment extracted to avoid circular dependencies
 */
import { q } from 'groqd';
import { COLOR_SCHEME_FRAGMENT } from './fragments';

/*
|--------------------------------------------------------------------------
| Section Settings
|--------------------------------------------------------------------------
*/
export const SECTION_SETTINGS_FRAGMENT = q('settings')
  .grab({
    colorScheme: q('colorScheme').deref().grab(COLOR_SCHEME_FRAGMENT),
    customCss: q
      .object({
        code: q.string().optional(),
      })
      .nullable(),
    hide: q.boolean().nullable(),
    padding: q
      .object({
        bottom: q.number().nullable(),
        top: q.number().nullable(),
      })
      .nullable(),
  })
  .nullable();

