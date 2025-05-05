#!/bin/bash

# Script de migração para estrutura monorepo ERGO.AI - ajustado para estrutura atual
# Autor: Claude
# Versão: 1.2

set -e # Para o script se houver qualquer erro

echo "🚀 Iniciando organização do monorepo ERGO.AI..."

# Verificar se o pnpm está instalado
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm não encontrado. Por favor, instale-o com: npm install -g pnpm"
    exit 1
fi

# Criar backup do projeto atual
echo "📦 Criando backup do projeto atual..."
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="../ergo-ai-backup-$TIMESTAMP"
mkdir -p "$BACKUP_DIR"
cp -r . "$BACKUP_DIR/"
echo "✅ Backup criado em: $BACKUP_DIR"

# Função para mover arquivo com verificação de existência
move_if_exists() {
    if [ -f "$1" ]; then
        mkdir -p "$(dirname "$2")"
        mv "$1" "$2"
        echo "✅ Movido: $1 -> $2"
    else
        echo "⚠️ Arquivo não encontrado: $1 (ignorando)"
    fi
}

# Função para mover diretório com verificação de existência
move_dir_if_exists() {
    if [ -d "$1" ]; then
        mkdir -p "$2"
        if [ "$(ls -A "$1" 2>/dev/null)" ]; then
            mv "$1"/* "$2"/
            echo "✅ Movido diretório: $1 -> $2"
            rm -rf "$1"  # Remover diretório vazio após mover conteúdo
        else
            echo "⚠️ Diretório vazio: $1"
        fi
    else
        echo "⚠️ Diretório não encontrado: $1 (ignorando)"
    fi
}

# Organizando a estrutura do monorepo
echo "🔄 Organizando a estrutura do monorepo..."

# Mover arquivos de app para apps/web
move_dir_if_exists "app" "apps/web/src/app"

# Mover arquivos CSS globais se estiverem no nível raiz
move_if_exists "globals.css" "apps/web/src/app/globals.css"
move_if_exists "grid-styles.css" "apps/web/src/app/grid-styles.css"

# Mover componentes se não estiverem já em apps/web
if [ -d "components" ] && [ ! -d "apps/web/src/components" ]; then
    mkdir -p "apps/web/src/components"
    mv components/* "apps/web/src/components/"
    rm -rf components
    echo "✅ Movido diretório: components -> apps/web/src/components"
fi

# Mover public para apps/web se ainda não estiver lá
if [ -d "public" ] && [ ! -d "apps/web/public" ]; then
    mkdir -p "apps/web/public"
    mv public/* "apps/web/public/"
    rm -rf public
    echo "✅ Movido diretório: public -> apps/web/public"
fi

# Mover hooks para packages/hooks se não estiverem lá
if [ -d "hooks" ] && [ ! -d "packages/hooks/src" ]; then
    mkdir -p "packages/hooks/src"
    mv hooks/* "packages/hooks/src/"
    rm -rf hooks
    echo "✅ Movido diretório: hooks -> packages/hooks/src"
fi

# Mover lib/i18n para packages/i18n se ainda não estiver lá
if [ -d "lib/i18n" ] && [ ! -d "packages/i18n/src" ]; then
    mkdir -p "packages/i18n/src"
    mv lib/i18n/* "packages/i18n/src/"
    echo "✅ Movido diretório: lib/i18n -> packages/i18n/src"

    # Se lib estiver vazio, remova-o
    if [ -z "$(ls -A lib 2>/dev/null)" ]; then
        rm -rf lib
    fi
fi

# Mover serviços para packages/api-client
if [ -d "services/auth" ] && [ ! -d "packages/api-client/src/auth" ]; then
    mkdir -p "packages/api-client/src/auth"
    mv services/auth/* "packages/api-client/src/auth/"
    echo "✅ Movido diretório: services/auth -> packages/api-client/src/auth"

    # Se services estiver vazio, remova-o
    if [ -z "$(ls -A services 2>/dev/null)" ]; then
        rm -rf services
    fi
fi

# Mover API para packages/api-client
if [ -d "api" ] && [ ! -d "packages/api-client/src/endpoints" ]; then
    mkdir -p "packages/api-client/src/endpoints"
    mv api/* "packages/api-client/src/endpoints/"
    rm -rf api
    echo "✅ Movido diretório: api -> packages/api-client/src/endpoints"
fi

# Mover types para packages/api-client
if [ -d "types" ] && [ ! -d "packages/api-client/src/types" ]; then
    mkdir -p "packages/api-client/src/types"
    mv types/* "packages/api-client/src/types/"
    rm -rf types
    echo "✅ Movido diretório: types -> packages/api-client/src/types"
fi

# Criar arquivo index.ts para api-client se não existir
if [ ! -f "packages/api-client/src/index.ts" ]; then
    cat > packages/api-client/src/index.ts << 'EOL'
export * from './auth/jwt-auth';
export * from './types';
export * from './endpoints';
EOL
    echo "✅ Criado: packages/api-client/src/index.ts"
fi

# Criar arquivo index.ts para os endpoints
if [ ! -f "packages/api-client/src/endpoints/index.ts" ]; then
    cat > packages/api-client/src/endpoints/index.ts << 'EOL'
export * from './modality';
export * from './coverage';
EOL
    echo "✅ Criado: packages/api-client/src/endpoints/index.ts"
fi

# Configurar arquivo index.ts para i18n
if [ ! -f "packages/i18n/src/index.ts" ]; then
    cat > packages/i18n/src/index.ts << 'EOL'
export * from './client';
export * from './server';
export * from './settings';
EOL
    echo "✅ Criado: packages/i18n/src/index.ts"
fi

# Configurar arquivo index.ts para hooks
if [ ! -f "packages/hooks/src/index.ts" ]; then
    cat > packages/hooks/src/index.ts << 'EOL'
export * from './useAllActiveModalities';
export * from './useCoveragesByModality';
export * from './useFileUpload';
EOL
    echo "✅ Criado: packages/hooks/src/index.ts"
fi

# Configurar package.json para web
if [ ! -f "apps/web/package.json" ]; then
    cat > apps/web/package.json << 'EOL'
{
  "name": "web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.17.1",
    "@ergo-ai/api-client": "workspace:*",
    "@ergo-ai/hooks": "workspace:*",
    "@ergo-ai/i18n": "workspace:*",
    "@ergo-ai/ui": "workspace:*",
    "@tanstack/react-query": "^5.75.0",
    "accept-language": "^3.0.18",
    "axios": "^1.9.0",
    "date-fns": "^4.1.0",
    "i18next": "^23.10.4",
    "i18next-resources-to-backend": "^1.2.1",
    "lucide-react": "^0.323.0",
    "next": "^15.3.1",
    "pdfjs-dist": "^4.1.1",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-i18next": "^14.0.5"
  },
  "devDependencies": {
    "@types/node": "^20.11.29",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "autoprefixer": "^10.4.17",
    "eslint": "^8.57.0",
    "eslint-config-next": "^15.0.0",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.3.3"
  }
}
EOL
    echo "✅ Criado: apps/web/package.json"
fi

# Mover arquivos de configuração
move_if_exists "next.config.ts" "apps/web/next.config.js"
move_if_exists "postcss.config.js" "apps/web/postcss.config.js"
move_if_exists "tailwind.config.js" "apps/web/tailwind.config.js"
move_if_exists "tsconfig.json" "apps/web/tsconfig.json"

# Configurar pacotes que ainda não existem
# api-client
if [ ! -f "packages/api-client/package.json" ]; then
    cat > packages/api-client/package.json << 'EOL'
{
  "name": "@ergo-ai/api-client",
  "version": "0.1.0",
  "private": true,
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "sideEffects": false,
  "scripts": {
    "build": "tsup src/index.ts --format esm,cjs --dts",
    "dev": "tsup src/index.ts --format esm,cjs --watch --dts",
    "lint": "eslint src/",
    "clean": "rm -rf .turbo && rm -rf node_modules && rm -rf dist"
  },
  "dependencies": {
    "axios": "^1.9.0"
  },
  "devDependencies": {
    "eslint": "^8.57.0",
    "typescript": "^5.3.3",
    "tsup": "^8.0.1"
  }
}
EOL
    echo "✅ Criado: packages/api-client/package.json"
fi

# i18n
if [ ! -f "packages/i18n/package.json" ]; then
    cat > packages/i18n/package.json << 'EOL'
{
  "name": "@ergo-ai/i18n",
  "version": "0.1.0",
  "private": true,
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "sideEffects": false,
  "scripts": {
    "build": "tsup src/index.ts --format esm,cjs --dts",
    "dev": "tsup src/index.ts --format esm,cjs --watch --dts",
    "lint": "eslint src/",
    "clean": "rm -rf .turbo && rm -rf node_modules && rm -rf dist"
  },
  "dependencies": {
    "i18next": "^23.10.4",
    "i18next-resources-to-backend": "^1.2.1",
    "react-i18next": "^14.0.5"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "eslint": "^8.57.0",
    "react": "^19.0.0",
    "tsup": "^8.0.1",
    "typescript": "^5.3.3"
  },
  "peerDependencies": {
    "react": ">=19.0.0"
  }
}
EOL
    echo "✅ Criado: packages/i18n/package.json"
fi

# hooks
if [ ! -f "packages/hooks/package.json" ]; then
    cat > packages/hooks/package.json << 'EOL'
{
  "name": "@ergo-ai/hooks",
  "version": "0.1.0",
  "private": true,
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "sideEffects": false,
  "scripts": {
    "build": "tsup src/index.ts --format esm,cjs --dts",
    "dev": "tsup src/index.ts --format esm,cjs --watch --dts",
    "lint": "eslint src/",
    "clean": "rm -rf .turbo && rm -rf node_modules && rm -rf dist"
  },
  "dependencies": {
    "@ergo-ai/api-client": "workspace:*",
    "@tanstack/react-query": "^5.75.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "eslint": "^8.57.0",
    "react": "^19.0.0",
    "tsup": "^8.0.1",
    "typescript": "^5.3.3"
  },
  "peerDependencies": {
    "react": ">=19.0.0"
  }
}
EOL
    echo "✅ Criado: packages/hooks/package.json"
fi

# ui
if [ ! -f "packages/ui/package.json" ]; then
    cat > packages/ui/package.json << 'EOL'
{
  "name": "@ergo-ai/ui",
  "version": "0.1.0",
  "private": true,
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "sideEffects": false,
  "scripts": {
    "build": "tsup src/index.ts --format esm,cjs --dts",
    "dev": "tsup src/index.ts --format esm,cjs --watch --dts",
    "lint": "eslint src/",
    "clean": "rm -rf .turbo && rm -rf node_modules && rm -rf dist"
  },
  "dependencies": {
    "@ergo-ai/hooks": "workspace:*",
    "lucide-react": "^0.323.0",
    "date-fns": "^4.1.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "autoprefixer": "^10.4.17",
    "eslint": "^8.57.0",
    "postcss": "^8.4.35",
    "react": "^19.0.0",
    "tailwindcss": "^3.4.1",
    "tsup": "^8.0.1",
    "typescript": "^5.3.3"
  },
  "peerDependencies": {
    "react": ">=19.0.0"
  }
}
EOL
    echo "✅ Criado: packages/ui/package.json"

    mkdir -p packages/ui/src
    cat > packages/ui/src/index.ts << 'EOL'
// Exportar componentes UI conforme eles forem migrados
EOL
    echo "✅ Criado: packages/ui/src/index.ts"
fi

# Atualizar package.json principal para usar o monorepo completo
cp package.json package.json.bak
cat > package.json << 'EOL'
{
  "name": "ergo-ai-surety-bond",
  "version": "0.1.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "start": "turbo run start --filter=web",
    "lint": "turbo run lint",
    "clean": "turbo run clean && rm -rf node_modules"
  },
  "devDependencies": {
    "eslint": "^8.57.0",
    "prettier": "^3.2.5",
    "turbo": "latest",
    "typescript": "^5.3.3"
  },
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  },
  "packageManager": "pnpm@8.15.1"
}
EOL
echo "✅ Atualizado: package.json"

# Atualizar turbo.json
cat > turbo.json << 'EOL'
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "start": {
      "cache": false
    },
    "clean": {
      "cache": false
    }
  }
}
EOL
echo "✅ Atualizado: turbo.json"

# Atualizar referências nos arquivos
echo "🔍 Atualizando importações nos arquivos..."

# Função para atualizar importações
update_imports() {
    local dir="$1"

    # Encontrar todos os arquivos TypeScript e TSX
    find "$dir" -type f -name "*.ts" -o -name "*.tsx" | while read -r file; do
        # Substituir importações
        sed -i 's|@/components|@/components|g' "$file"
        sed -i 's|@/hooks|@ergo-ai/hooks|g' "$file"
        sed -i 's|@/lib/i18n|@ergo-ai/i18n|g' "$file"
        sed -i 's|@/api|@ergo-ai/api-client|g' "$file"
        sed -i 's|@/services/auth|@ergo-ai/api-client/auth|g' "$file"

        echo "  Atualizadas importações em: $file"
    done
}

# Atualizar importações nos componentes
# Descomentado temporariamente por ser potencialmente arriscado
# update_imports "apps/web/src"
# update_imports "packages"

echo "✅ Estrutura do monorepo organizada com sucesso!"
echo "⚠️ Você precisa atualizar as importações nos arquivos manualmente para refletir a nova estrutura."
echo "   Por exemplo: '@/lib/i18n' -> '@ergo-ai/i18n'"
echo "   Isso foi feito de forma conservadora para evitar quebrar o código."
echo ""
echo "📋 Próximos passos:"
echo "  1. pnpm install"
echo "  2. Atualizar importações nos arquivos"
echo "  3. pnpm dev"
echo "  4. Migrar componentes de UI para packages/ui gradualmente"
echo ""
echo "🚀 Sua migração está em andamento. Este é um processo gradual."
