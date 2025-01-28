# Étape 1 : Construction avec une image Alpine
FROM node:18-alpine AS builder

# Installer uniquement les outils nécessaires pour Alpine
RUN apk add --no-cache python3 make g++

# Définir le répertoire de travail
WORKDIR /app

# Copier uniquement les fichiers essentiels pour installer les dépendances
COPY package.json package-lock.json ./

# Installer les dépendances en deux étapes (production + dev pour le build)
RUN npm ci --only=production && npm install --only=dev

# Copier tout le code source
COPY . .

# Construire l'application avec SvelteKit
RUN npm run build

# Supprimer les dépendances de développement après le build
RUN rm -rf node_modules && npm ci --only=production

# Étape 2 : Exécution avec une image minimale
FROM node:18-alpine AS runner

# Définir le répertoire de travail
WORKDIR /app

# Copier uniquement les fichiers nécessaires depuis le builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Supprimer les fichiers inutiles
RUN rm -rf /var/cache/apk/* /tmp/*

# Exposer le port 3000
EXPOSE 3000

# Lancer l'application
CMD ["node", "build"]
