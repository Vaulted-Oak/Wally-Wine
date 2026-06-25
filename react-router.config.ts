import type {Config} from '@react-router/dev/config';
import {flatRoutes} from '@react-router/fs-routes';

export default {
  appDirectory: 'app',
  buildDirectory: 'build',
  ssr: true,
  async routes(defineRoutes) {
    return flatRoutes('routes', defineRoutes);
  },
} satisfies Config;

