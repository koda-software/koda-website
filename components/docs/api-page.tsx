'use client';

import { createOpenAPIPage } from 'fumadocs-openapi/ui';

import {
  LocalizedSchemaUI,
  type LocalizedSchemaUIProps,
} from '@/components/docs/localized-schema-ui';
import { PlaygroundResultDisplay } from '@/components/docs/playground-result-display';

export const OpenAPIPage = createOpenAPIPage({
  playground: {
    components: {
      ResultDisplay: PlaygroundResultDisplay,
    },
  },
  schemaUI: {
    render: (props, ctx) => (
      <LocalizedSchemaUI
        {...(props as Omit<LocalizedSchemaUIProps, 'ctx'>)}
        ctx={ctx}
      />
    ),
  },
});
