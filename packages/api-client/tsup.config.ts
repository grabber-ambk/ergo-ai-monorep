import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    external: ['@tanstack/react-query', 'google-auth-library', 'jsonwebtoken'],
    clean: true,
});
