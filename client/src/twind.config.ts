import { defineConfig } from '@twind/core';
import presetTailwind from '@twind/preset-tailwind';
import presetAutoprefix from '@twind/preset-autoprefix';

const config = defineConfig({
  presets: [presetAutoprefix(), presetTailwind()],
});

export default config;
