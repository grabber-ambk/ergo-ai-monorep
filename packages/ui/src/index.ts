// Layout
export * from './layout/Sidebar';
export * from './layout/Header';
export * from './layout/MainLayout';

// Common Components
export * from './common/LanguageSelector';
export * from './common/UserProfileMenu';

// Client Components
export * from './client/ModalitySelectorClient';
export * from './client/CoverageSelectorClient';

export * from './utils/ClientOnlyIcon'

// Default exports
export { default as Sidebar } from './layout/Sidebar';
export { default as Header } from './layout/Header';
export { default as MainLayout } from './layout/MainLayout';
export { LanguageSelector } from './common/LanguageSelector';
export { default as UserProfileMenu } from './common/UserProfileMenu';
export { ModalitySelectionClient } from './client/ModalitySelectorClient';
export { CoverageSelectorClient } from './client/CoverageSelectorClient';
export { ClientOnlyIcon } from './utils/ClientOnlyIcon'

// Types
export * from './types'
